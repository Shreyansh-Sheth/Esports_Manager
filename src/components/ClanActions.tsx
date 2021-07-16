import { useEffect, useRef, useState } from "react";
import { auth, firestore } from "../config/firebaseConfig";
import { deleteClanRequest, KickFromClan } from "../functions/ClanHelper";
import { iClan } from "../interfaces/iClan";
import Modal from "./modal";
import AlertBox from "./AlertBox";
import { Console } from "console";
import { useRouter } from "next/router";

export default function ClanActions({ clanData }: iProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [requestDeleteClanModelVisible, setRequestDeleteClanModelVisible] =
    useState(false);
  const [changePasswordModelVisible, setChangePasswordModelVisible] =
    useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pickImageName, setPickImageName] = useState("");
  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user && clanData) {
        setIsAdmin(clanData.clanLeaderId === user.uid);
      }
    });
  }, [clanData]);

  const validImageTypes = ["png", "jpg", "jpeg"];
  const fileRef = useRef<HTMLInputElement>(null);
  //For Uploading Image
  async function uploadImage() {
    const token = await auth.currentUser?.getIdToken();
    if (token && fileRef.current?.files && fileRef.current?.files[0]) {
      if (fileRef.current.files[0].size > 154747) {
        setAlertMessage("image Should Be Less Than 150KB");
        setAlertVisible(true);
        return;
      }
      const reader = new FileReader();
      reader.readAsBinaryString(fileRef.current.files[0]);
      reader.onload = () => {
        //@ts-ignore
        const fileData = fileRef.current.files[0];
        const fileType =
          fileData.name.split(".")[fileData.name.split(".").length - 1];
        if (!validImageTypes.includes(fileType)) {
          setAlertMessage("File Type Must Be JPG,JPEG,PNG");
          setAlertVisible(true);
          return;
        }

        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: reader.result,
            token,
            clanId: clanData.clanName,
          }),
        };
        fetch("/api/clanImage", options)
          .then(async (res) => {
            const json = await res.json();
            if (json.err) {
              setAlertMessage(json.message);
              setAlertVisible(true);
            } else {
              router.reload();
            }
          })
          .catch((e) => {
            setAlertMessage("There Is Some Error");
            setAlertVisible(true);
          });
      };
    } else {
      setAlertMessage("You Have Not Selected Any Image");
      setAlertVisible(true);
    }
  }
  return (
    <div className={`mt-5  p-2 text-white  bg-gray-800`}>
      <div
        key="members"
        className="text-left mb-2 text--2 font-semibold text-primary-500"
      >
        Clan Actions
      </div>
      <div className="text-black">
        <AlertBox
          visible={alertVisible}
          setVisible={setAlertVisible}
          type="bg-red-300"
          text={alertMessage}
        ></AlertBox>
      </div>
      <div className="lg:px-16 ">
        {isAdmin && (
          <div className="mb-3">
            <p className="lg:text-left  text-center">Change Clan Icon</p>
            <p className="text-xs">
              Clan Logo Can Only Be Change Once Per 7 Days
            </p>
            <div className="flex justify-between overflow-hidden">
              <div className="flex">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png image/jpeg"
                  name="uploadfile"
                  id="img"
                  className="text-white "
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0])
                      setPickImageName(e?.target?.files[0].name);
                  }}
                />

                <label htmlFor="img" className="btn--primary inline">
                  Pick Image
                </label>
                {pickImageName !== "" && (
                  <p className="text-primary-500 my-auto  ">{pickImageName}</p>
                )}
              </div>
              <button
                onClick={uploadImage}
                className="block md:inline btn--primary"
              >
                Save
              </button>
            </div>
            <hr></hr>
          </div>
        )}
        {!isAdmin && (
          <div className=" text-base text--4 ">
            <Modal
              key="modle"
              visible={modelVisible}
              failureText="cancle"
              sucessText="quit clan"
              onFailure={() => {
                setModelVisible(false);
              }}
              onSuccess={() => {
                KickFromClan(
                  clanData.clanName,
                  auth.currentUser?.uid as string,
                  auth.currentUser?.displayName as string,
                  clanData.primayGame
                );
                setModelVisible(false);
              }}
            >
              <p>Are You Sure You Want To Quit This Clan</p>
            </Modal>
            <span className="">Leave Clan</span>
            <button
              className="btn--primary text-xs bg-red-600"
              onClick={(e) => {
                setModelVisible(true);
              }}
            >
              Quit Clan
            </button>
          </div>
        )}
        {isAdmin && (
          <>
            <div className="lg:flex justify-between  text-base border-black border-1">
              <Modal
                key="modlePassword"
                visible={changePasswordModelVisible}
                failureText="cancle"
                sucessText="change password"
                onFailure={() => {
                  setChangePasswordModelVisible(false);
                }}
                onSuccess={async () => {
                  try {
                    if (oldPassword === newPassword) {
                      setAlertMessage("Both Password Can't Be Same");
                      setAlertVisible(true);
                      return;
                    }
                    if (newPassword.length < 3) {
                      setAlertMessage("Password is too short");
                      setAlertVisible(true);
                      return;
                    }
                    const secretRef = firestore
                      .collection(`/clan/${clanData.clanName}/secret`)
                      .doc("data");

                    await secretRef.set(
                      {
                        oldPassword,
                        password: newPassword,
                      },
                      { merge: true }
                    );
                  } catch (E) {
                    setAlertMessage(
                      "You Are Not Able To Change Clan Password! Contact Us For Any Help"
                    );
                    setAlertVisible(true);
                  } finally {
                    setChangePasswordModelVisible(false);
                    setNewPassword("");
                    setOldPassword("");
                  }
                  //Request To Chnage Password
                }}
              >
                <div className="space-y-2">
                  <div className="md:flex justify-center ">
                    <label className="mr-2">Old Password</label>
                    <input
                      className="input--primary  w-auto p-auto mx-0"
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    ></input>
                  </div>
                  <div className="mb-3 md:flex justify-center ">
                    <label className="mr-2">New Password</label>
                    <input
                      className="input--primary   w-auto p-auto mx-0"
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    ></input>
                  </div>
                </div>
              </Modal>
              <div className="flex lg:flex-row flex-col w-full justify-between">
                <span className="text-center">Change Password</span>
                <button
                  className="btn--primary text-xs inline lg:block font-semibold bg-red-600"
                  onClick={(e) => {
                    setChangePasswordModelVisible(true);
                  }}
                >
                  Change
                </button>
              </div>
            </div>
            <hr></hr>
            <div className=" lg:flex lg:justify-between text-base border-black border-1">
              <Modal
                failureText="Cancel"
                sucessText="Confirm"
                key="xaxa"
                visible={requestDeleteClanModelVisible}
                onFailure={() => {
                  setRequestDeleteClanModelVisible(false);
                }}
                onSuccess={() => {
                  if (reason.trim().length === 0) {
                    return;
                  }
                  if (
                    !clanData.requests?.includes("Delete Clan") &&
                    clanData.clanLeaderId === auth.currentUser?.uid
                  ) {
                    deleteClanRequest(clanData.clanName, reason.trim());
                  }
                  setRequestDeleteClanModelVisible(false);
                }}
              >
                {!clanData.requests?.includes("Delete Clan") ? (
                  <>
                    <p className="font-semibold">
                      Are You sure You want To Delete This clan?
                    </p>
                    <hr></hr>
                    <div className="md:flex justify-center ">
                      <input
                        onChange={(e) => setReason(e.target.value)}
                        className="input--primary  w-auto p-auto mx-0"
                        id="reason"
                        placeholder="Reason"
                      ></input>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <p className="text-red-500">
                  {reason.trim().length === 0 ? "please enter some reason" : ""}
                </p>
                <p className="block ">
                  Your Clan Automaticaly Delets After Week. Contact Us To Stop
                  This Action.
                </p>
              </Modal>
              <div className="flex lg:flex-row flex-col w-full justify-between">
                <span className="text-center">Delete Clan</span>
                <button
                  className="btn--primary text-xs bg-red-600 font-semibold inline lg:block"
                  onClick={(e) => {
                    if (clanData.requests?.includes("Delete Clan")) {
                      setAlertVisible(true);
                      setAlertMessage("delete clan already requested");
                      return;
                    }
                    setRequestDeleteClanModelVisible(true);
                  }}
                >
                  Request Delete Clan
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
interface iProps {
  clanData: iClan;
}
