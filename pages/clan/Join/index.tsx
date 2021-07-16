/*
 Dataset Needed:
    -clan
    -user


interactions:
    -* Enter Clan Name
    -* Enter Password

    
    -After Creating clan Add this property to user doc
        -Name 
        -id
        -primary game
 */

import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import AlertBox from "../../../src/components/AlertBox";
import { JoinClan } from "../../../src/functions/ClanHelper";

export default function Join() {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [clanName, setClanName] = useState("");
  const [clanPassword, setClanPassword] = useState("");
  const router = useRouter();
  return (
    <div>
      <div>
        <AlertBox
          visible={visibleAlert}
          setVisible={setVisibleAlert}
          type="bg-blue-300"
          text={alertText}
        ></AlertBox>
      </div>
      <div
        className={`bg-gray-800 text-white w-11/12 md:w-1/2 mx-3 border-2 md:mx-auto border-black shadow-right-offset my-11 pb-3`}
      >
        <p className={"text--2 py-2 text-center font-semibold"}>Join Clan</p>
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
          <label className="block" htmlFor="pass">
            clan password
          </label>
          <input
            value={clanPassword}
            onChange={(e) => setClanPassword(e.target.value)}
            type="password"
            name="pass"
            placeholder="Clan Password"
            className="input--primary"
          ></input>
        </div>
        <div className="text-center mt-3">
          <button
            className="btn--primary"
            onClick={async (e) => {
              const x = await JoinClan(clanName, clanPassword);
              if (x == true) {
                router.push("/clan");
              } else {
                setVisibleAlert(true);
                setAlertText(x);
              }
            }}
          >
            Join Clan
          </button>
        </div>
      </div>
    </div>
  );
}
