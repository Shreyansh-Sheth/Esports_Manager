import { useRouter } from "next/dist/client/router";
import { useEffect, useRef, useState } from "react";
import AlertBox from "../../src/components/AlertBox";
import ClanActions from "../../src/components/ClanActions";
import ClanMemberList from "../../src/components/ClanMembersList";
import { auth, firestore } from "../../src/config/firebaseConfig";
import { iClan } from "../../src/interfaces/iClan";
import Image from "next/image";
import MatchHistory from "./MatchHistory";
import { getClanImageUrl } from "../functions/getClanImageUrl";

export default function ClanViewer({ id }: { id?: string }) {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const [clanData, setClanData] = useState<iClan>();
  const [clanMember, setClanMember] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [clanId, setClanId] = useState<string>();

  const [imageUrl, setImageUrl] = useState(
    "/assets/images/clan_placeholder.png"
  );

  const router = useRouter();
  useEffect(() => {
    if (id) {
      setClanId(id);
    } else {
      try {
        setClanId(router?.query?.clanId as string);
      } catch {
        router.push("/");
      }
    }

    const unsubscribe = firestore
      .collection("clan")
      .doc(clanId as string)
      .onSnapshot(
        async (doc) => {
          if (doc.exists) {
            const data = doc.data() as iClan;
            setClanData(data);
          } else {
            router.push("/");
          }
        },
        (error) => {
          router.push("/");
        }
      );

    return () => {
      unsubscribe();
    };
  }, [clanId]);
  //set ui based on clan member or not
  useEffect(() => {
    let memberB = false;
    if (clanData) {
      clanData.members.forEach((element) => {
        if (element.id === auth.currentUser?.uid) {
          memberB = true;
        }
      });
    }
    setClanMember(memberB);
  }, [clanData]);
  //Check FOr admin
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (clanData) {
        setIsAdmin(clanData.clanLeaderId === user?.uid);
      }
    });
  }, [clanData]);

  useEffect(() => {
    if (clanData) {
      getClanImageUrl(clanData.clanName).then((data) => {
        setImageUrl(data);
      });
    }
  }, [clanData]);
  return (
    <div className="mx-2">
      <AlertBox
        setVisible={setVisibleAlert}
        visible={visibleAlert}
        type="bg-blue-300"
        text={alertText}
        key="visible"
      ></AlertBox>
      {clanData && (
        <>
          <div className={`bg-gray-800 py-3 my-5 overflow-hidden`}>
            <div className={`mt-2 my-auto`}>
              <div className="flex justify-center">
                <Image src={imageUrl} width={128} height={128}></Image>
              </div>
            </div>
            <div className="">
              <p
                className={` my-auto text--1 italic text-white text-center overflow-ellipsis font-bold  tracking-wide`}
              >
                {clanData.clanName}
              </p>
              <p
                className={`mt-3 text--3 italic text-primary-500 text-center underline  font-semibold`}
              >
                "{clanData.clanTagline}"
              </p>
            </div>
          </div>
          <ClanMemberList
            setVisibleAlert={setVisibleAlert}
            setAlertText={setAlertText}
            clanData={clanData}
            key="clanMemberList"
            clanId={clanId as string}
          ></ClanMemberList>
          <MatchHistory data={clanData?.participatedTournaments}></MatchHistory>
          {
            //Alerts About Clan Delets
          }
          {(isAdmin || clanMember) &&
            clanData.requests?.includes("Delete Clan") && (
              <div className="bg-red-600 text-white mt-2 p-2">
                Your Clan Is Going To Delete After Some Time. Contact Us To
                Resolve This Issue.
              </div>
            )}
          {(isAdmin || clanMember) && (
            <ClanActions key="xasx" clanData={clanData}></ClanActions>
          )}
        </>
      )}
    </div>
  );
}
