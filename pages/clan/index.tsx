import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { auth, firestore } from "../../src/config/firebaseConfig";
import Head from "next/head";
import iUser, { iClanDataForUser } from "../../src/interfaces/iUser";
import { FaCrown } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import ClanViewer from "../../src/components/ClanViewer";

export default function Clan() {
  const router = useRouter();
  const [myClans, setMyClans] = useState<iClanDataForUser[]>();
  const [clanState, setClanState] = useState<"Loading..." | "Nothing To Show">(
    "Loading..."
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.isAnonymous) {
        return;
      }

      if (user) {
        firestore
          .collection("/user")
          .doc(user.uid)
          .get()
          .then((doc) => {
            let data = doc.data() as unknown as iUser;
         //   console.log(data);
            if (!data) {
              return;
            }
            if (!data.clanData) {
              setClanState("Nothing To Show");
            }
            if (data.clanData) {
              setMyClans(data.clanData);
            }
          });
      }
    });
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user || user.isAnonymous) {
        router.push("/");
      }
    });
  }, []);
 

  return (
    <div>
      <Head>
        <title>Clan</title>
      </Head>

      {(typeof myClans === "undefined" || myClans.length === 0) && (
        <ClanInteractionButton></ClanInteractionButton>
      )}
      {myClans && myClans?.length > 0 && (
        <ClanViewer id={myClans[0].name}></ClanViewer>
        
      )}
    </div>
  );
}
function ClanInteractionButton() {
  const router = useRouter();
  return (
    <div
      className={` text-center text--2 font-semibold  mx-2
     mt-5`}
    >
      <div
        className=" flex-grow mt-3 md:mt-0 bg-gray-800 text-white focus:bg-gray-800"
        onClick={(e) => {
          router.push("/clan/create");
        }}
      >
        <FaCrown className="text-8xl mx-auto text-primary-500"></FaCrown>
        <p>Create Clan</p>
      </div>
      <div
        className=" flex-grow mt-3  text-white bg-gray-800 focus:bg-gray-800"
        onClick={(e) => {
          router.push("/clan/Join");
        }}
      >
        <IoIosPeople className="mx-auto text-8xl text-primary-500"></IoIosPeople>
        <p>Join Clan</p>
      </div>
    </div>
  );
}
