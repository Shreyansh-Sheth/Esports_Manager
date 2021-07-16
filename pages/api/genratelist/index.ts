import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { isTagName } from "../../../src/functions/GamerTagHelper";
import { iClan } from "../../../src/interfaces/iClan";
import iTournament from "../../../src/interfaces/iTournament";
import { firestore } from "../../../src/secret/firebaseAdmin";
import verifyToken from "../../../src/secret/verifyAuthToken";
import { auth } from "../../../src/secret/firebaseAdmin";
const GenrateList = nc<NextApiRequest, NextApiResponse>();
GenrateList.post(async (req, res) => {
  const token = req.body.token;
  const gameId = req.body.gameId;
  const tournamentId = req.body.tournamentId;

  const UserAuthData = await verifyToken(token);
  if (!UserAuthData) {
    res.status(404);
    res.end();
    return;
  }
  const NewUserData = await auth.getUser(UserAuthData?.uid);
  if (
    NewUserData.customClaims &&
    NewUserData.customClaims["role"] &&
    NewUserData.customClaims["role"] !== "admin"
  ) {
    res.status(404);
    res.end();
    return;
  }
  try {
    const tournamentData = (
      await firestore
        .collection(`/games/${gameId}/tournaments`)
        .doc(tournamentId)
        .get()
    ).data() as unknown as iTournament;
    if (!tournamentData) {
      throw "No Data Here";
    }
    const secretTournamentRef = firestore
      .collection(`/games/${gameId}/tournaments/${tournamentId}/secret`)
      .doc("registerPlayers");

    //    Send Already Made Data To User
    const secretTournamentData = await secretTournamentRef.get();
    if (secretTournamentData.exists) {
      res.send(secretTournamentData.data()?.data);
      res.end();
      return;
    }

    const isUserBased = tournamentData.info.playerType === "solo";

    //Do searching For Peoples Only
    if (isUserBased) {
      const AllUserTags = [];
      for (let i = 0; i < tournamentData.participatesList.length; i++) {
        AllUserTags.push(
          await GetGamerTagFromUserId(
            tournamentData.participatesList[i].id,
            gameId
          )
        );
      }
      //set secret data
      await secretTournamentRef.set({ data: AllUserTags });
      res.send(AllUserTags);
      return;
    } else {
      //Do Searching For Clan Only
      const AllUserTags = [];
      for (let i = 0; i < tournamentData.participatesList.length; i++) {
        AllUserTags.push(
          await GetGamerTagsForClans(
            tournamentData.participatesList[i].id,
            gameId
          )
        );
      }
      //set secret data
      await secretTournamentRef.set({ data: AllUserTags });
      res.send(AllUserTags);
      return;
    }

    //Return Data
  } catch (e) {
 //   console.log(e);
    res.send("There Is Some Error");
    res.end();
    return;
  }
});

export default GenrateList;

const GetGamerTagsForClans = async (
  id: string,
  gameId: string
): Promise<iClanMemberTags> => {
  try {
    const clanData = (
      await firestore.collection("/clan").doc(id).get()
    ).data() as iClan;
    if (!clanData) {
      throw "Error";
    }
    const AllMemberIds = [];
    for (let i = 0; i < clanData.members.length; i++) {
      AllMemberIds.push(
        await GetGamerTagFromUserId(clanData.members[i].id, gameId)
      );
    }

    return { [id]: { memberTags: AllMemberIds } };
  } catch {
    return { [id]: { memberTags: [] } };
  }
};

const GetGamerTagFromUserId = async (
  id: string,
  gameId: string
): Promise<itagForUser> => {
  try {
    const UserSecretData = (
      await firestore.collection(`/user/${id}/private`).doc(`gamertags`).get()
    ).data();
    if (!UserSecretData || !UserSecretData.gamerTags) {
      throw "Data Not Found";
    }
    const data = getGamerTag(UserSecretData.gamerTags, gameId);
    if (data === undefined) {
      throw "User Data Not Found";
    }
    const gamerTag = isTagName(gameId)
      ? `${data.gamerTag}##${data.tag}`
      : `${data.gamerTag}`;
    return { id: id, gamerTag };
  } catch {
    return { id: id, gamerTag: "NOT SET" };
  }
};
interface iTag {
  gameId: string;
  gamerTag: string;
  tag?: string;
}
interface itagForUser {
  id: string;
  gamerTag: string;
}
interface iClanMemberTags {
  [id: string]: {
    memberTags: itagForUser[];
  };
}
const getGamerTag = (list: iTag[], gameId: string): iTag | undefined => {
  const ret = list.find((e) => {
    if (e.gameId === gameId) {
      return true;
    } else {
      return false;
    }
  });

  return ret;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20kb",
    },
  },
};

/**
 *
 * 400 => Parameters Are Not right
 * 401 => Token is Not Correct
 *
 *
 */
