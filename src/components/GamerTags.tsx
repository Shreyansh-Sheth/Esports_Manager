import { useEffect, useState } from "react";
import { auth, firestore } from "../config/firebaseConfig";

import firebase from "firebase/app";
import { iGamerTagData } from "../interfaces/iGame";
import GamertagEditor from "./GamerTagInput";
import { gameIds } from "../data/mainGameData";
import { useRouter } from "next/router";
export default function GamerTagsView() {
  const router = useRouter();
  const [gamerTags, setGamerTags] = useState<iGamerTagData[]>([]);
  const [firebaseDoc, setFirebaseDoc] =
    useState<
      firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
    >();
  const [uid, setUid] = useState<string>();
  const [avilGames, setAvilGames] = useState<string[]>();
  useEffect(() => {
    let mounted = true;
    auth.onAuthStateChanged(async (user) => {
      if (user?.isAnonymous) {
        router.push("/");
      }
      if (user && mounted) {
        setUid(user.uid);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (uid) {
      readData();
    }
  }, [uid]);
  const readData = async () => {
    const doc = firestore.collection(`user/${uid}/private`).doc("gamertags");
    setFirebaseDoc(doc);

    try {
      let ids: string[] = [];
      Object.entries(gameIds).map((e) => {
        ids.push(e[1]);
      });
      const data = (await doc.get()).data();
      if (!data) {
        setAvilGames(ids);
        return;
      }

      setGamerTags(data.gamerTags as iGamerTagData[]);

      data?.gamerTags?.map((e: iGamerTagData) => {
        if (ids.includes(e.gameId)) {
          ids.splice(ids.indexOf(e.gameId), 1);
        }
      });

      setAvilGames(ids);
    } catch (e) {
      return;
    }
  };

  return (
    <div className="mt-5 mx-5 p-2 bg-gray-800">
      <div className="text--2 text-primary-500">Gamer Tags</div>
      <hr></hr>
      <div>
        {gamerTags.map((e, id) => {
          return (
            <GamertagEditor
              data={e}
              key={id}
              refresh={readData}
            ></GamertagEditor>
          );
        })}
        {avilGames && avilGames.length > 0 && (
          <GamertagEditor
            avilSelect={avilGames}
            newDoc={true}
            refresh={readData}
          ></GamertagEditor>
        )}
      </div>
    </div>
  );
}
