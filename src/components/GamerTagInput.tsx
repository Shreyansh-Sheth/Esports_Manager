import { firestore, auth } from "../config/firebaseConfig";
import firebase from "firebase";
import { useEffect } from "react";
import { useState } from "react";
import {
  gameIds,
  MainGameData,
  iMainGameData,
  getGameDataById,
} from "../data/mainGameData";
import { iGamerTagData } from "../interfaces/iGame";
import { AiOutlineEdit } from "react-icons/ai";
import { strict } from "assert";
import {
  extraInfoType,
  getExtraInfo,
  isTagName,
} from "../functions/GamerTagHelper";
import AlertBox from "./AlertBox";
export default function GamertagEditor({
  newDoc = false,
  avilSelect,
  data,
  refresh,
}: {
  newDoc?: boolean;
  avilSelect?: string[];
  data?: iGamerTagData;
  refresh: () => Promise<void>;
}) {
  const [gameData, setGameData] = useState<iMainGameData>(MainGameData[0]);
  const [name, setName] = useState<string>("");
  const [tag, setTag] = useState<string | undefined>("");
  const [editing, setEditing] = useState<boolean>(false);
  const [extraInfo, setExtraInfo] = useState<extraInfoType | false>();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  useEffect(() => {
    if (data && !newDoc) {
      const x = getGameDataById(data.gameId);
      if (x) {
        setGameData(x);
        setName(data.gamerTag);
        setTag(data.tag);
        setEditing(false);
      }
    }
    if (newDoc) {
      setEditing(true);
    }
  }, [data]);

  //Extra Instruction About GamerTags
  useEffect(() => {
    if (gameData.gameId) {
      setExtraInfo(getExtraInfo(gameData.gameId));
    }
  }, [gameData.gameId]);

  useEffect(() => {
    if (avilSelect && typeof avilSelect[0] === "string") {
      setGameData(getGameDataById(avilSelect[0]) as iMainGameData);
    }
  }, [avilSelect]);
  return (
    <>
      <AlertBox
        setVisible={setAlertVisible}
        visible={alertVisible}
        text={alertText}
        type="bg-red-300"
      ></AlertBox>
      <div className="text-white grid lg:grid-cols-4 grid-flow-row  p-2">
        {newDoc && avilSelect && (
          <div className="text-center">
            <select
              className="bg-gray-800  text-primary-500 focus:ring-0 focus-within:border-primary-500 "
              value={gameData.gameId}
              onChange={(e) => {
                setGameData(getGameDataById(e.target.value) as iMainGameData);
              }}
            >
              {avilSelect.map((e, i) => {
                return (
                  <option value={e} className="text-white" key={i}>
                    {getGameDataById(e)?.gameName}
                  </option>
                );
              })}
            </select>
            {extraInfo && (
              <p className="text-xs  text-gray-400">{extraInfo.info}</p>
            )}
          </div>
        )}
        {!newDoc && (
          <div className="text--3 w-full lg:col-span-1 col-span-2 text-primary-500  font-black mt-3 ">
            {gameData.gameName}
          </div>
        )}
        <div className="col-span-2 mx-auto ">
          <div className="">
            <label className=" text--4 lg:mr-5 w-1/2 mr-3">GamerTag</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`text-black mt-2 border-primary-400 border-2 text--4 ${
                !editing
                  ? "bg-transparent text-primary-500 text-center font-semibold "
                  : "bg-white"
              }`}
              type="string"
              disabled={!editing}
              placeholder="GamerTag"
            ></input>
          </div>
          {isTagName(gameData.gameId) && (
            <div className="mt-2">
              <label className=" text--4 lg:mr-5 mr-3">{`Tagline `}</label>
              <input
                className={`text-black mt-2 border-primary-400  border-2 text--4 ${
                  !editing
                    ? "bg-transparent text-primary-500 text-center font-semibold "
                    : "bg-white"
                }`}
                type="string"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                disabled={!editing}
                placeholder="Tag"
              ></input>
            </div>
          )}
        </div>
        {editing && (
          <div className="flex justify-evenly gap-2 lg:mt-0 mt-2 text-center col-span-2 lg:col-span-1">
            {!newDoc && (
              <button
                className="btn btn--primary h-8 lg:mt-0 mt-2 my-auto w-full text-center"
                onClick={(e) => {
                  setEditing(false);
                  if (data) {
                    setName(data?.gamerTag);
                    setTag(data?.tag);
                  }
                }}
              >
                Cancel
              </button>
            )}
            <button
              className="btn btn--primary h-8 lg:mt-0 mt-2 my-auto w-full text-center"
              onClick={async () => {
                const token = await auth.currentUser?.getIdToken();
                if (name.length < 2 || name.length > 50) {
                  // show Error That You Have Empty Gaamertag field

                  setAlertVisible(true);
                  setAlertText("Gamertag should be between 2-50 charachters");
                  refresh();
                  return;
                }
                const data = {
                  token: token,
                  gameId: gameData.gameId,
                  gamerTag: name,
                };
                if (isTagName(gameData.gameId)) {
                  if (
                    typeof tag === "undefined" ||
                    tag.length < 2 ||
                    tag.length > 50
                  ) {
                    // show Error That You Have Empty Gaamertag field
                    setAlertVisible(true);
                    setAlertText("Gamertag should be between 2-50 charachters");
                    refresh();
                    return;
                  }
                  //@ts-ignore
                  data.tagLine = tag;
                }
                //Save That Data To Firebase Via Api
                const res = await fetch("/api/gamertag", {
                  method: "POST",

                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });
                if (res.status !== 200) {
                  //TODO Erro Handling
                } else {
                  refresh();
                  setName("");
                  setTag("");
                }
              }}
            >
              Save
            </button>
          </div>
        )}
        {!editing && (
          <button
            className="btn btn--primary h-8 lg:mt-0 mt-2 my-auto text-center col-span-2 lg:col-span-1"
            onClick={(e) => {
              setEditing(true);
            }}
          >
            Edit
          </button>
        )}
      </div>
      <hr></hr>
    </>
  );
}
