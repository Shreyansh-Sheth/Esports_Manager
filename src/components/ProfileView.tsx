import { auth, firestore } from "../config/firebaseConfig";
import { useEffect } from "react";
import { useState } from "react";
import iUser from "../interfaces/iUser";
import MatchHistory from "./MatchHistory";
import { GrUserSettings } from "react-icons/gr";
import { FcSettings } from "react-icons/fc";
import { AiOutlineSetting } from "react-icons/ai";
import { useRouter } from "next/router";
export default function ProfileView({
  userId,
}: {
  userId: string | undefined;
}) {
  const router = useRouter();
  const [isMe, setIsMe] = useState(false);
  const [userData, setUserData] = useState<iUser>();

  //for anonomus user
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.isAnonymous) {
        return;
      }
    });
  }, []);

  //set is me
  useEffect(() => {
    if (auth.currentUser?.uid === userId) {
      setIsMe(true);
    }
  }, [userId, auth.currentUser]);

  //Load UserData
  useEffect(() => {
    const retriveUserData = async () => {
      if (!userId && userData) {
        return;
      }
      const userRef = await firestore.collection(`/user`).doc(userId).get();
      const userDataFs = userRef.data();
      setUserData(userDataFs as iUser);
    };
    retriveUserData();
  }, [userId]);

  return (
    <div className="mx-2 text-white p-2 mt-5 overflow-hidden">
      {
        //Main Section With Routing
      }
      <div className=" bg-gray-800 text-white p-2">
        <div>
          {isMe && <p className="text--3">Hello,</p>}
          <span className="font-semibold text--2 inline-block text-primary-500">
            {isMe ? auth.currentUser?.displayName : userData?.nickname}
          </span>
        </div>
      </div>
      {
        //Gamertag Setting
      }
      {isMe && (
        <div
          onClick={() => {
            router.push("/gamertag");
          }}
          className="bg-gray-800 cursor-pointer flex  justify-between mt-5 text--3 p-2 "
        >
          <div>Manage Gamertag</div>
          <AiOutlineSetting className="my-auto text-primary-600 "></AiOutlineSetting>
        </div>
      )}

      {
        //Clan
      }
      {userData &&
        userData.clanData &&
        typeof userData.clanData[0].name === "string" && (
          <div
            className="bg-gray-800 cursor-pointer mt-5 text--3 p-2 "
            onClick={(e) => {
              if (
                userData &&
                userData.clanData &&
                typeof userData.clanData[0].name === "string"
              ) {
                router.push(`/clan/${userData.clanData[0].name}`);
              }
            }}
          >
            <div>Clan</div>

            <div className="md:flex justify-between border-2 border-white p-2 mt-2">
              <div className="text-primary-500 font-semibold overflow-ellipsis ">
                {userData.clanData[0].name}
              </div>
              <div className="text--4 my-auto">
                {userData.clanData[0].primayGame}
              </div>
            </div>
          </div>
        )}
      {
        //Past Games And Tournaments
      }
      <MatchHistory data={userData?.participatedTournaments}></MatchHistory>
    </div>
  );
}
