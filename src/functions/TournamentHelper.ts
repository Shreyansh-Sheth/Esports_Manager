import { analytics, firestore } from "../config/firebaseConfig";
import iTournament, { iTournamentIndex } from "../interfaces/iTournament";
import firebase from "firebase/app";

export default async function CreatePrivateTournament(data: iTournament) {
  const tournamentIndex: iTournamentIndex = {
    id: "NAN",
    matchStartDate: data.eventStartingDate,
    registrationEndDate: data.participationCloseDate,
    name: data.name,
  };
  const privateTournamenCollection = firestore
    .collection(`/games/${data.gameId}/private/`)
    .doc();
  const privateTournamentIndexDoc = firestore
    .collection(`/games/${data.gameId}/private/`)
    .doc("index");

  const batch = firestore.batch();
  //Set Data to private tournament list
  await batch.set(privateTournamenCollection, data);
  //get the id
  tournamentIndex.id = privateTournamenCollection.id;
  //set that to main list to acsess
  batch.set(
    privateTournamentIndexDoc,
    {
      tournaments: firebase.firestore.FieldValue.arrayUnion(tournamentIndex),
    },
    { merge: true }
  );
  try {
    await batch.commit();
  } catch (e) {}
}
