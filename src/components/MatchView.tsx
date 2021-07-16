import { useEffect } from "react";
import { useState } from "react";
import { auth, firestore } from "../config/firebaseConfig";
import GetUserRole from "../functions/GetUserRoles";
import iTournament from "../interfaces/iTournament";
import { userRoleType } from "../interfaces/iUser";
import Markdown from "./Markdown";

export default function MatchView({
  tournamentData,
  tournamentId,
}: {
  tournamentData: iTournament;
  tournamentId?: string;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mdData, setMdData] = useState<string>();
  useEffect(() => {
    const getUser = async () => {
      if ((await GetUserRole()) === "admin") {
        setIsAdmin(true);
      }
    };
    getUser();
  }, [auth.currentUser]);
  useEffect(() => {
    if (typeof tournamentData.matches === undefined) {
      setMdData("");
    } else {
      setMdData(tournamentData.matches);
    }
  }, [tournamentData]);
  const saveData = () => {
    const dbRef = firestore
      .collection(`games/${tournamentData.gameId}/tournaments`)
      .doc(tournamentId);
    dbRef.update({
      matches: mdData,
    });
  };
  return (
    <div className="bg-gray-800 mt-5 p-2  mb-5">
      <div className="text--2 text-primary-500">Matches</div>
      {(mdData === "" || !mdData) && (
        <div className="text-center text-white ">Nothing To Show</div>
      )}
      {isAdmin && (
        <button
          className="btn--primary"
          onClick={(e) => {
            saveData();
          }}
        >
          Save
        </button>
      )}
      <Markdown
        dark={true}
        markdown={mdData ? mdData : ""}
        markdownOnChange={(data) => {
          setMdData(data);
        }}
        rawHtml={true}
        hidden={!isAdmin}
      ></Markdown>
    </div>
  );
}
