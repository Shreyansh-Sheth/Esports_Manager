/*

For Normal User:
    - This List Shows All Clan Members With Links To their User Profiles
For Clan Admin:
    -Ability To kick someone from clan
    -Ability to make someone admin insted of them
 */

import { useRouter } from "next/dist/client/router";
import { SetStateAction, useEffect, useState } from "react";
import { auth, firestore } from "../config/firebaseConfig";
import { iClan } from "../interfaces/iClan";
import { GrLinkNext } from "react-icons/gr";
import { CgCrown } from "react-icons/cg";
import { KickFromClan } from "../functions/ClanHelper";
import { Dispatch } from "react";
import Modal from "./modal";
export default function ClanMemberList({
  clanId,
  clanData,
  setAlertText,
  setVisibleAlert,
}: iProps) {
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (clanData) {
        setIsAdmin(clanData.clanLeaderId === user?.uid);
      }
    });
  }, [clanData]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [kickUserData, setKickUserData] = useState<{
    name: string;
    id: string;
    primaryGame: string;
  }>();

  return (
    <div className={` bg-gray-800 mt-5 p-2 text-white `}>
      <Modal
        failureText="Cancel"
        sucessText="Confirm"
        visible={modalVisible}
        onSuccess={async () => {
          if (!kickUserData) {
            return;
          }
          const res = await KickFromClan(
            clanId,
            kickUserData?.id,
            kickUserData?.name,
            kickUserData?.primaryGame
          );
          setModalVisible(false);

          if (typeof res == "string") {
            setAlertText("Something went wrong");
            setVisibleAlert(true);
          }
        }}
        onFailure={() => {
          setModalVisible(false);
        }}
      >
        Are You Sure You Want To Kick{" "}
        <span className="font-semibold">{kickUserData?.name}</span> from clan ?
      </Modal>
      <div
        key="members"
        className="text-left text-primary-500 font-semibold text--2 mb-2"
      >
        Members
      </div>
      <div>
        {clanData?.members.map((member, idx) => {
          return (
            <div
              key={idx}
              className={` overflow-hidden  mb-2 bg-gray-800 hover:bg-gray-600 transition duration-200 ease-in-out flex justify-between`}
            >
              <div
                className={`text--4  px-2 flex cursor-pointer  whitespace-pre  `}
                onClick={(e) => {
                  router.push(`/profile/${member.id}`);
                }}
              >
                {member.name}
                {member.id === clanData.clanLeaderId && (
                  <CgCrown className="text--4 ml-2  my-auto text-primary-400"></CgCrown>
                )}
              </div>

              {isAdmin && member.id !== auth.currentUser?.uid && (
                <button
                  className="btn--secondary m-1 bg-red-500"
                  onClick={(e) => {
                    setKickUserData({
                      id: member.id,
                      name: member.name,
                      primaryGame: clanData.primayGame,
                    });
                    setModalVisible(true);
                  }}
                >
                  Kick
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface iProps {
  clanData: iClan;
  clanId: string;
  setVisibleAlert: Dispatch<SetStateAction<boolean>>;
  setAlertText: Dispatch<SetStateAction<string>>;
}
