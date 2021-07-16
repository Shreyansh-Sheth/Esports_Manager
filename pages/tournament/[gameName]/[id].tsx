/*
Dataset Needed:
    -Single Tournament Deatil Based On Id

Data To Show:
    -Tournament Id
    -Tournament Name --String--
    -Time   --Date--
    -Status(open | close)
    -PlayerType (Team | Single)
    -PlayerCapacity (10 players) --Number--
    -Seates Avilable (10 seates availabel) --Numbers--
    -Tournament Rules  --Quill--
    -Tournament Info (A Big Doc That contains Price pool and info about how games willl playout) --Quill--
    -How To Join Info --Quill--
    -Tree Of Brackets OR Score Board --Tree--
    -List Of player Joined Or List Of clans --list--
    
    -Tournament Entry Id/Pass => Info dynamically add for users to join on time of event
    

Interactions:
    
    -Button To Join
        -Have Gamertag for that player 
        -Check For Rules 
        -Acccept Terms For Playing This 
        -Select from Clan Or Join By Player if single player availabel
    
*/

import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import TournamentView from "../../../src/components/TournamentView";
import { firestore, auth } from "../../../src/config/firebaseConfig";

import iTournament, {
  iRegistrationData,
  iTournamentIndex,
} from "../../../src/interfaces/iTournament";

import AlertBox from "../../../src/components/AlertBox";
import Modal from "../../../src/components/modal";
import iUser from "../../../src/interfaces/iUser";
import GetUserRole from "../../../src/functions/GetUserRoles";
import { addInitialDataToUserDoc } from "../../../src/functions/addInitialDataToUserDoc";
export default function AdminTournamentView() {
  const router = useRouter();

  const [tournamentData, setTournamentData] = useState<iTournament>();
  const [registered, setRegistered] = useState<boolean>(false);
  const [userData, setUserData] = useState<iUser>();
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [rulesChecked, setRulesChecked] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>(
    "There Is Some Server Error Please Try Again Later"
  );
  const [modelVisible, setModelVisible] = useState<boolean>(false);
  const [registerButtonActive, setRegisterButtonActive] =
    useState<boolean>(false);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      if ((await GetUserRole()) === "admin") {
        setIsAdmin(true);
      }
    };
    getUser();
  }, [auth.currentUser]);
  useEffect(() => {
    const { gameName, id } = router.query;

    const getDataFromFirestore = async () => {
      try {
        const data = (
          await firestore
            .collection(`games/${gameName}/tournaments/`)
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

  useEffect(() => {
    const setRegisterAndUserData = async () => {
      if (auth.currentUser?.isAnonymous) {
        return;
      }
      if (!tournamentData) {
        return;
      }
      if (tournamentData.info.playerType == "solo") {
        tournamentData.participatesList?.find((e) => {
          if (e.id === auth?.currentUser?.uid) {
            setRegistered(true);
          }
        });
      } else {
        // Have To Load User Data To show user selector of clan on register
        // load user data
        const userData = (
          await firestore.collection("user").doc(auth.currentUser?.uid).get()
        ).data() as unknown as iUser;
        setUserData(userData);
        // check if any clan from user is joined to the tournament (Using Clan Id)
        if (
          userData &&
          userData.clanData &&
          userData.clanData.length > 0 &&
          tournamentData.participatesList
        ) {
          userData.clanData.forEach((user) => {
            tournamentData.participatesList?.find((tournament) => {
              if (tournament.id === user.name) {
                setRegistered(true);
                return;
              }
            });
          });
        }
      }
    };
    setRegisterAndUserData();
  }, [tournamentData]);

  useEffect(() => {
    if (rulesChecked && termsChecked) {
      setRegisterButtonActive(true);
    } else {
      setRegisterButtonActive(false);
    }
  }, [rulesChecked, termsChecked]);
  const endTournament = async () => {
    const { gameName, id } = router.query;
    try {
      const TournamentIndexs = await (
        await firestore
          .collection(`games/${gameName}/tournaments/`)
          .doc("index")
          .get()
      ).data();
      if (!TournamentIndexs || !TournamentIndexs.tournaments) {
        throw "No Data Found";
      }
      //Creating new index
      const newIndex = TournamentIndexs.tournaments.map(
        (e: iTournamentIndex, i: number) => {
          const newData = e;
          if (newData.id === id) {
            newData.isEnded = true;
            return newData;
          } else {
            return newData;
          }
        }
      );
      //Upload new Data
      const ref = await firestore
        .collection(`games/${gameName}/tournaments/`)
        .doc("index");

      await ref.update({ tournaments: newIndex });

      alert("Set To Ended");
    } catch {
      alert("This Is Throwing Some Error");
    }
  };

  return (
    <div>
      <AlertBox
        type="bg-red-300"
        setVisible={setAlertVisible}
        text={alertText}
        visible={alertVisible}
      ></AlertBox>
      {tournamentData && (
        <TournamentView
          tournamentId={router.query.id as string}
          data={tournamentData}
          gameId={router.query.gameName as string}
          registered={registered}
        >
          <div className="mb-2">
            {isAdmin && (
              <>
                <button
                  className="btn"
                  onClick={(e) => {
                    const ask = window.confirm(
                      "DO YOU REALLY WANT TO END THIS TOURNAMENT??"
                    );
                    if (!ask) {
                      return;
                    }
                    endTournament();
                  }}
                >
                  End This Tournament
                </button>
                <button
                  className="btn"
                  onClick={async (e) => {
                    const ask = window.confirm(
                      "DO YOU  WANT TO GENRATE LIST OF PARTICIPATES??"
                    );
                    if (!ask) {
                      return;
                    }
                    const tournamentId = router.query.id as string;
                    const gameId = router.query.gameName as string;
                    await genrateList(tournamentId, gameId);
                  }}
                >
                  Genrate List Of Participates
                </button>
              </>
            )}
            {registered && (
              <div className="text-center px-1 border-primary-800 my-5 font-semibold border-dashed border-2">
                You Are Registered For This Tournament
              </div>
            )}
            {tournamentData.participates < tournamentData.participationLimit &&
              tournamentData.participationCloseDate > Date.now() &&
              !registered && (
                <button
                  onClick={async () => {
                    if (auth.currentUser?.isAnonymous) {
                      setAlertVisible(true);
                      setAlertText("You Have To Login For Register");
                      return;
                    }
                    const token = await auth.currentUser?.getIdToken();
                    if (!token) {
                      setAlertVisible(true);
                      setAlertText(
                        "There Is Some Problem Please Try Again Later"
                      );
                      return;
                    }
                    if (tournamentData.info.playerType !== "solo") {
                      if (
                        !userData ||
                        typeof userData.clanData === "undefined" ||
                        typeof userData.clanData[0] === "undefined"
                      ) {
                        setAlertVisible(true);
                        setAlertText("You Are Not In Any Clan");
                        return;
                      }
                      if (
                        typeof userData.clanData[0].isAdmin === "undefined" ||
                        userData.clanData[0].isAdmin === false
                      ) {
                        setAlertVisible(true);
                        setAlertText(
                          "Only Clan Leader Can Register For Clan(Ask Your Clan Leader)"
                        );
                        return;
                      }
                    }
                    setModelVisible(true);
                  }}
                  className="btn btn--primary w-full md:w-max my-2 h-16  font-semibold"
                >
                  Register
                </button>
              )}
          </div>
        </TournamentView>
      )}
      <Modal
        visible={modelVisible}
        onFailure={() => {
          setModelVisible(false);
        }}
        failureText="Cancel"
        sucessText="Register"
        showSucessAction={registerButtonActive}
        onSuccess={async () => {
          const token = await auth.currentUser?.getIdToken();
          if (!token) {
            setAlertText("There Is Some Error Please Try Again Later");
            setAlertVisible(true);
            return;
          }
          //Get Tournament id and check if data is loaded

          const id = router.query.id as string;
          if (!id && typeof id !== "string") {
            // alert somethin went wrong please try again letter
            setAlertVisible(true);
            setAlertText("There Is Some Problem Please Try Again Later");
            return;
          }

          if (!tournamentData) {
            //Redirect for not avilabe tournament
            router.push("/");
            return;
          }
          //Check if Tournament is full or not and if full show alert

          if (
            tournamentData.participates >= tournamentData.participationLimit
          ) {
            setAlertText("Tournament Is Full");
            setAlertVisible(true);
            setModelVisible(false);
            return;
          }

          const data: iRegistrationData = {
            token: token,
            gameId: tournamentData.gameId,
            tournamentId: id,
          };
          if (
            tournamentData.info.playerType !== "solo" &&
            !userData?.clanData
          ) {
            return;
          }

          if (tournamentData.info.playerType !== "solo" && userData?.clanData) {
            data.clanId = userData?.clanData[0].name;
          }
          if (auth.currentUser?.displayName) {
            await addInitialDataToUserDoc(
              null,
              auth.currentUser?.displayName,
              auth.currentUser?.uid
            );
          }
          const res = await fetch("/api/tournament/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const response = await res.json();
          console.log(response);
          if (response.Error) {
            setAlertVisible(true);
            setAlertText(response.Message);
          } else {
            setTournamentData({
              ...tournamentData,
              participates: tournamentData.participates + 1,
            });
            setRegistered(true);
          }
          setModelVisible(false);
        }}
      >
        <div>
          <div className="bg-gray-800 mb-3 p-2 text-white">
            {
              //For Solo Player
            }
            {tournamentData?.info.playerType === "solo" && (
              <div className="font-semibold">
                You Are Participating On This Tournament Solo
              </div>
            )}
            {
              //For Clan Admin
            }
            {tournamentData?.info.playerType !== "solo" &&
              userData?.clanData &&
              userData?.clanData[0]?.isAdmin && (
                <>
                  <div className="text--3">
                    You Are Selecting Your Clan{" "}
                    <span className="text-semibold underline">
                      "{userData.clanData[0].name}"
                    </span>
                    For Participating In This Tournament
                  </div>
                </>
              )}
          </div>
          <div className="mb-2 pb-2">
            <hr className="border-black mx-5"></hr>
            <div className="space-x-2 ">
              <input
                type="checkbox"
                onChange={(e) => setTermsChecked(e.target.checked)}
              ></input>
              <label>
                I Agreed On All The Terms And conditions of this platform.
              </label>
            </div>
            <hr className="border-black mx-5"></hr>
            <div className="space-x-2">
              <input
                type="checkbox"
                onChange={(e) => setRulesChecked(e.target.checked)}
              ></input>
              <label>I Agreed On All The Rules For The Tournament.</label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
/*
You Can Only Register If
=> You are admin of clan
=> Your Team has sufficient amount of players
=> Your whole clan has gamerTag for that game
*/

const genrateList = async (tournamentId: string, gameId: string) => {
  const token = await auth.currentUser?.getIdToken();
  const data = {
    token,
    tournamentId,
    gameId,
  };

  const res = await fetch("/api/genratelist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // console.log(res);
  const text = await (await res.blob()).text();

  // console.log(await res.json());
  // console.log(await res.text());
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", tournamentId + "__" + gameId);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
