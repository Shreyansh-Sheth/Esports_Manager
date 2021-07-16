import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import TournamentView from "../../../../src/components/TournamentView";
import { firestore } from "../../../../src/config/firebaseConfig";
import firebase from "firebase/app";
import iTournament, {
  iTournamentIndex,
} from "../../../../src/interfaces/iTournament";
export default function AdminTournamentView() {
  const router = useRouter();

  const [tournamentData, setTournamentData] = useState<iTournament>();
  useEffect(() => {
    const { gameName, id } = router.query;

    const getDataFromFirestore = async () => {
      try {
        const data = (
          await firestore
            .collection(`games/${gameName}/private/`)
            .doc(id as string)
            .get()
        ).data();
        setTournamentData(data as unknown as iTournament);
      } catch (e) {
        router.back();
      }
    };
    if (typeof gameName === "string" && typeof id === "string") {
      getDataFromFirestore();
    }
  }, [router.query]);

  const makeDataPublic = async () => {
    const ask = window.confirm("DO YOU REALLY WANT TO MAKE THIS PUBLIC??");
    if (!ask) {
      return;
    }
    if (!tournamentData) {
      console.error("Data Does Not Exist");
      return;
    }

    //Get refs
    const tournament = firestore
      .collection(`games/${router.query.gameName}/tournaments`)
      .doc();
    const index = firestore
      .collection(`games/${router.query.gameName}/tournaments`)
      .doc("index");

    const privateIndexs = (
      await firestore
        .collection(`/games/${router.query.gameName}/private`)
        .doc("index")
        .get()
    ).data() as { tournaments: iTournamentIndex[] };

    const privateIndex = privateIndexs.tournaments.find((e) => {
      if (e.id === router.query.id) {
        return true;
      }
      return false;
    });

    if (!privateIndex) {
      console.error("No Private Index Found");
    }

    const PrivateData = firestore
      .collection(`games/${router.query.gameName}/private`)
      .doc(privateIndex?.id);

    //create index data
    const indexData: iTournamentIndex = {
      id: tournament.id,
      matchStartDate: tournamentData?.eventStartingDate,
      registrationEndDate: tournamentData?.participationCloseDate,
      name: tournamentData.name,
    };

    //Create Transaction
    const batch = firestore.batch();

    //set data
    try {
      //Setting data to public
      batch.set(tournament, tournamentData);
      batch.set(
        index,
        {
          tournaments: firebase.firestore.FieldValue.arrayUnion(indexData),
        },
        { merge: true }
      );

      //Removing Data From Private
      batch.delete(PrivateData);
      batch.update(
        firestore
          .collection(`/games/${router.query.gameName}/private`)
          .doc("index"),
        { tournaments: firebase.firestore.FieldValue.arrayRemove(privateIndex) }
      );

      await batch.commit();
      router.back();
    } catch (e) {
      Error(e);
    }
  };
  const deleteTournament = async () => {
    debugger;
    if (!window.confirm("DO YOU REALLY WANT TO DELETE THIS??")) {
      return;
    }
    if (!tournamentData) {
      console.error("Data Does Not Exist");
      return;
    }

    const privateIndexs = (
      await firestore
        .collection(`/games/${router.query.gameName}/private`)
        .doc("index")
        .get()
    ).data() as { tournaments: iTournamentIndex[] };

    const privateIndex = privateIndexs.tournaments.find((e) => {
      if (e.id === router.query.id) {
        return true;
      }
      return false;
    });
    if (!privateIndex) {
      console.error("No Private Index Found");
    }

    const PrivateData = firestore
      .collection(`games/${router.query.gameName}/private`)
      .doc(privateIndex?.id);

    //Create Transaction
    const batch = firestore.batch();

    //set data
    try {
      //Removing Data From Private
      batch.delete(PrivateData);
      batch.update(
        firestore
          .collection(`/games/${router.query.gameName}/private`)
          .doc("index"),
        { tournaments: firebase.firestore.FieldValue.arrayRemove(privateIndex) }
      );

      await batch.commit();
      router.back();
    } catch (e) {
      Error(e);
    }
  };

  return (
    <div>
      {tournamentData && (
        <TournamentView
          registered={false}
          data={tournamentData}
          gameId={router.query.gameName as string}
        >
          <div>
            <button
              className="btn btn--primary w-full md:w-max my-2 h-16  font-semibold"
              onClick={makeDataPublic}
            >
              Make It Public
            </button>
            <button
              className="btn  w-full md:w-max my-2 h-16  font-semibold"
              onClick={deleteTournament}
            >
              Delete
            </button>
          </div>
        </TournamentView>
      )}
    </div>
  );
}
