import { firestore } from "../config/firebaseConfig";
import firebase from "firebase/app";

export function addInitialDataToUserDoc(
  birthdate: firebase.firestore.Timestamp | null,
  nickname: string,
  userId: string
) {
  if (birthdate === null) {
    firestore
      .collection("user")
      .doc(userId)
      .set(
        {
          nickname: nickname,
        },
        { merge: true }
      )
      .catch((err) => {});
  } else {
    firestore
      .collection("user")
      .doc(userId)
      .set(
        {
          birthdate: birthdate,
          nickname: nickname,
        },
        { merge: true }
      )
      .catch((err) => {});
  }
}
