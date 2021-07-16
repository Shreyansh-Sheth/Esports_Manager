import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { auth } from "../../../src/config/firebaseConfig";
import AlertBox from "../../../src/components/AlertBox";
import { CreateClan } from "../../../src/functions/ClanHelper";
import Modal from "../../../src/components/modal";
import gamesData from "../../../src/data/gamesCard";
/*
Dataset Needed:
    -clan
    -user

Interactions:
    -* set clan Name (Unique)
    -* set clan tagline
    -* set clan password
    -* set clan Portfolio //for future not now
    -* set primary game 


    -After Creating clan Add this property to user doc
        -Name 
        -id
        -primary game
*/
export default function Create() {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const [clanName, setClanName] = useState("");
  const [tagLine, setTagline] = useState("");
  const [password, setPassword] = useState("");
  const [primaryGame, setPrimaryGame] = useState(gamesData[0].name);
  const [specificGame, setSpecificGame] = useState<string>("");

  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.isAnonymous) {
        router.push("/");
        return;
      }
      if (user) {
      } else {
        router.push("/");
      }
    });
  }, []);
  return (
    <div>
      <div>
        <AlertBox
          visible={visibleAlert}
          setVisible={setVisibleAlert}
          type="bg-blue-300"
          text={alertText}
        ></AlertBox>
        <div
          className={`w-11/12 md:w-1/2 mx-3 border-2 bg-gray-800 text-white md:mx-auto border-black shadow-right-offset my-11 pb-3`}
        >
          <p className={"text--2 py-2 text-center font-semibold"}>
            {" "}
            Create Clan
          </p>
          <div>
            <div className="px-3 pt-2">
              <label className="block" htmlFor="clanName">
                Clan Name
              </label>
              <input
                value={clanName}
                onChange={(e) => setClanName(e.target.value)}
                name="clanName"
                placeholder="Clan Name"
                className="input--primary"
              ></input>
            </div>
            <div className="px-3 pt-2">
              <label className="block" htmlFor="Tagline">
                Tagline
              </label>
              <input
                value={tagLine}
                onChange={(e) => setTagline(e.target.value)}
                name="Tagline"
                placeholder="Clan Tagline"
                className="input--primary"
              ></input>
            </div>
            <div className="px-3 pt-2">
              <label className="block" htmlFor="pass">
                clan password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="pass"
                placeholder="Clan Password"
                className="input--primary"
              ></input>
            </div>
            <div className="px-3 pt-2">
              <label className="block" htmlFor="cgame">
                Primary Clan Game
              </label>
              <select
                value={primaryGame}
                onChange={(e) => setPrimaryGame(e.target.value)}
                name="cgame"
                placeholder="Clan Game"
                className="input--primary"
              >
                {gamesData.map((e, i) => (
                  <option value={e.name} key={i}>
                    {e.name}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
            {primaryGame === "Other" && (
              <div className="px-3 pt-2">
                <label className="block" htmlFor="spg">
                  Please Specify Game
                </label>
                <input
                  required
                  value={specificGame.toString()}
                  onChange={(e) => setSpecificGame(e.target.value)}
                  name="spg"
                  placeholder="Clan Primary Game"
                  className="input--primary"
                ></input>
              </div>
            )}
            <div className="text-center mt-3">
              <button
                className="btn--primary"
                onClick={async (e) => {
                  let pG = primaryGame === "Other" ? specificGame : primaryGame;
                 
                  const out = await CreateClan(clanName, password, tagLine, pG);
                  if (out === true) {
                    router.push("/clan");
                    return;
                  }
                  setAlertText(out);
                  setVisibleAlert(true);
                }}
              >
                Create Clan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
