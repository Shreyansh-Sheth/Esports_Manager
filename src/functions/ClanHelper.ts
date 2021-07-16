import { iClan } from "../interfaces/iClan";
import { auth, firestore } from "../config/firebaseConfig";
import iUser, { iClanDataForUser } from "../interfaces/iUser";
import firebase from "firebase/app";

//Knobs
const clanLimit = 6;

export async function CreateClan(
  clanName: string,
  clanPass: string,
  clanTagline: string,
  clanPrimaryGame: string
): Promise<string | true> {
  if (auth.currentUser === null) {
    return "Please Login To Create Clan";
  }

  clanName = clanName.trim();
  clanPass = clanPass.trim();
  clanTagline = clanTagline.trim();
  clanPrimaryGame = clanPrimaryGame.trim().toLowerCase();

  if (clanName.includes("/") || clanName.includes(".")) {
    return "you cannot put . or / in your clan name";
  }
  if (clanName.length < 3 || clanName.length > 100) {
    return "please write clanname between 3 to 100 letters";
  }
  if (clanPass.length < 6 || clanPass.length > 100) {
    return "please enter stronger clan password";
  }
  if (clanTagline.length <= 3 || clanTagline.length > 100) {
    return "please enter clan tag between 4 and 100 letters";
  }
  if (clanPrimaryGame === "") {
    return "please enter primary game";
  }
  const clanRef = firestore.collection("/clan").doc(clanName);

  await auth.currentUser.getIdTokenResult(true);
  if ((await clanRef.get()).exists) {
    return "This Clan Name is Already Taken";
  }

  const userRef = firestore.collection(`/user`).doc(auth.currentUser.uid);
  const clanSecretRef = firestore
    .collection(`/clan/${clanRef.id}/secret`)
    .doc("data");
  console.log("Here");

  if ((await userRef.get()).exists === false) {
    console.log("Here 2");

    userRef.set({ nickname: auth.currentUser.displayName });
  }

  const batch = firestore.batch();

  //Creating Clan Documnet
  batch.set(clanRef, {
    clanLeaderId: auth.currentUser.uid,
    clanName: clanName,
    clanTagline: clanTagline,
    members: [{ id: auth.currentUser.uid, name: auth.currentUser.displayName }],
    primayGame: clanPrimaryGame.trim(),
  } as iClan);

  // Changing User Document
  batch.update(userRef, {
    clanData: firebase.firestore.FieldValue.arrayUnion({
      name: clanName,
      primayGame: clanPrimaryGame,
      isAdmin: true,
    } as iClanDataForUser),
  });

  //Creating document for password
  batch.set(clanSecretRef, {
    password: clanPass,
    membersId: [auth.currentUser.uid],
  });

  //commit all changes
  const out: string | boolean = await batch
    .commit()
    .then(() => {
      return true;
    })
    .catch((err) => {
      return "there is some error";
    });

  //For ts
  if (out === false) {
    return true;
  }
  return out;
}

export async function JoinClan(
  name: string,
  password: string
): Promise<string | true> {
  if (auth.currentUser === null) {
    return "Please Login To Join Clan";
  }
  const clanRef = firestore.collection("clan").doc(name);
  const userRef = firestore.collection("user").doc(auth.currentUser.uid);
  const secretRef = clanRef.collection("secret").doc("data");
  if (!(await clanRef.get()).exists) {
    return "clan does not exist with this name";
  }

  const userHasData = await (await userRef.get()).data();

  if (userHasData && userHasData.clanData) {
    const userCheck = userHasData.clanData;
    for (let index = 0; index < userCheck.length; index++) {
      if (userCheck[index].name === name) {
        return "You are Already In That Clan";
      }
    }
  }
  if (!userHasData) {
    userRef.set({ nickname: auth.currentUser.displayName });
  }

  const clanData = (await clanRef.get()).data() as iClan;
  if (clanData.members.length >= clanLimit) {
    return "clan is full";
  }

  const batch = firestore.batch();

  batch.update(userRef, {
    clanData: firebase.firestore.FieldValue.arrayUnion({
      name: clanData.clanName,
      primayGame: clanData.primayGame,
    } as iClanDataForUser),
  });

  batch.update(clanRef, {
    members: firebase.firestore.FieldValue.arrayUnion({
      id: auth.currentUser?.uid,
      name: auth.currentUser?.displayName,
    }),
  });

  batch.update(secretRef, {
    password: password,
    membersId: firebase.firestore.FieldValue.arrayUnion(auth.currentUser?.uid),
  });
  const m = await batch.commit().catch((e) => {
    return "Password does not match";
  });
  if (m) {
    return m;
  } else {
    return true;
  }
}

/**
 *  @description this function used to kick or leave from the clan
 * @param clanId id of that particular clan
 * @param userId userid of member you want to remove
 * @param userName username of that member
 * @param primaryGame primary game of that clan
 * @returns string(error message) or true(if request completes)
 */
export async function KickFromClan(
  clanId: string,
  userId: string,
  userName: string,
  primaryGame: string
): Promise<string | true> {
  const userDocRef = await firestore.collection("user").doc(userId);
  const clanDocRef = firestore.collection("clan").doc(clanId);
  const clanSecretRef = await clanDocRef.collection("secret").doc("data");
  const batch = firestore.batch();

  await batch.update(userDocRef, {
    clanData: firebase.firestore.FieldValue.arrayRemove({
      name: clanId,
      primayGame: primaryGame,
    }),
  });
  batch.update(clanDocRef, {
    members: firebase.firestore.FieldValue.arrayRemove({
      id: userId,
      name: userName,
    }),
  });
  batch.update(clanSecretRef, {
    membersId: firebase.firestore.FieldValue.arrayRemove(userId),
  });

  const m = await batch
    .commit()
    .then(() => {
      return true;
    })
    .catch(() => {
      return "somethig went wrong";
    });

  if (m) {
    return m;
  } else {
    return true;
  }
}

//check from clan data for leaderId , clanRequests ,
//check for only one doc update and also reason and clan name
//create this in firestore requests/clanDelets => clanData[]
export async function deleteClanRequest(
  clanName: string,
  reason: string
): Promise<string | boolean> {
  if (reason.trim().length === 0) {
    return "please enter reason";
  }
  const batch = firestore.batch();
  const requestRef = firestore.collection("requests").doc("clanDelets");
  const clanRef = firestore.collection("clan").doc(clanName);
  batch.update(requestRef, {
    clanData: firebase.firestore.FieldValue.arrayUnion({
      clanName,
      reason,
    }),
  });

  batch.update(clanRef, {
    requests: firebase.firestore.FieldValue.arrayUnion("Delete Clan"),
  });
  const out = batch
    .commit()
    .then(() => {
      return true;
    })
    .catch((err) => {
      return "there is some error";
    });
  return out;
}
