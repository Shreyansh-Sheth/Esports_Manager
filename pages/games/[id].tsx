/*
Dataset Needed:
   
    -Tournament Doc For That Game (This single Doc contains list of tournament that is running and happning in future)


Data To Show:
    -Tournament Name
    -Time
    -Status(open , close)
    -PlayerCapacity (20 teams , 90 Players)

Interactions:
    click to go to specific tournament page
*/

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import gameInfo, { iGameInfo } from "../../src/data/gameInfo";
import TournamentList from "../../src/components/TournamentList";
import GetUserRole from "../../src/functions/GetUserRoles";
import { auth, firestore } from "../../src/config/firebaseConfig";
import Link from "next/link";
import { iTournamentIndex } from "../../src/interfaces/iTournament";

export default function GameIds() {
  const router = useRouter();
  const [gameData, setGameData] = useState<iGameInfo>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<iTournamentIndex[]>();
  const [tournamentIndexs, setTournamentIndexs] =
    useState<iTournamentIndex[]>();
  //Get info from route
  useEffect(() => {
    const gameId = router.query.id;
    const data = gameInfo.find((e) => {
      if (e.gameId === gameId) {
        return true;
      }
      return false;
    });
    setGameData(data);
  }, [router.query.id]);

  //Get Tournaments Data And Sort Them
  useEffect(() => {
    const getData = async () => {
      if (gameData) {
        try {
          const index = (
            await firestore
              .collection(`games/${gameData.gameId}/tournaments`)
              .doc("index")
              .get()
          ).data() as { tournaments: iTournamentIndex[] };

          setTournamentIndexs(index.tournaments);
        } catch (e) {
          setTournamentIndexs([]);
          Error("Data Not Found");
        }
      }
    };
    getData();
  }, [gameData]);

  //Check For admin
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setIsAdmin(false);
      }
      if ((await GetUserRole()) === "admin") {
        setIsAdmin(true);
      }
    });
  });
  //Set Data to admin private section
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user && isAdmin) {
        const data = (
          await firestore
            .collection(`/games/${router.query.id}/private`)
            .doc("index")
            .get()
        ).data();
        if (data?.tournaments) {
          setAdminData(data?.tournaments as iTournamentIndex[]);
        }
      }
    });
  }, [isAdmin]);

  return (
    <div className="mt-5 mb-5">
      {gameData && (
        <div>
          <hr className="bg-primary-300"></hr>

          <div className="capitalize text-center text--1 tracking-wider font-bold">
            {gameData.name}
          </div>
          <hr className="bg-primary-300"></hr>

          <TournamentList
            gameNameId={gameData.gameId}
            heading="Open For Regestration"
            tournamentIndexList={tournamentIndexs?.filter((v, i) => {
              if (!v.isEnded && Date.now() < v.registrationEndDate) {
                return true;
              }
              return false;
            })}
          ></TournamentList>

          <TournamentList
            gameNameId={gameData.gameId}
            heading="Currently Running"
            tournamentIndexList={tournamentIndexs?.filter((v, i) => {
              if (!v.isEnded && Date.now() > v.matchStartDate) {
                return true;
              }
              return false;
            })}
          ></TournamentList>
          <TournamentList
            gameNameId={gameData.gameId}
            heading="Ended"
            tournamentIndexList={tournamentIndexs?.filter((v, i) => {
              if (v.isEnded) {
                return true;
              }
              return false;
            })}
          ></TournamentList>
        </div>
      )}
      {isAdmin && (
        <>
          {adminData && gameData && (
            <TournamentList
              gameNameId={gameData.gameId}
              heading="Private"
              tournamentIndexList={adminData}
            ></TournamentList>
          )}
          <Link href="/admin/tournament">
            <div className="border-box text-center cursor-pointer">
              + Add Tournament
            </div>
          </Link>
        </>
      )}
    </div>
  );
}
