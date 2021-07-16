import Head from "next/head";
import { useEffect, useState } from "react";
import AlertBox from "../src/components/AlertBox";
import { auth } from "../src/config/firebaseConfig";
import GetUserRole from "../src/functions/GetUserRoles";
import { userRoleType } from "../src/interfaces/iUser";
import { RiMouseLine } from "react-icons/ri";
import Image from "next/image";
export default function Home() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userRole, setUserRole] = useState<userRoleType>("not-user");
  useEffect(() => {
    let mounted = true;
    auth.onAuthStateChanged(async (user) => {
      if (user?.isAnonymous) {
        setAlertVisible(false);
        return;
      }
      if (user && mounted) {
        setUserRole(await GetUserRole());
        if (!user.emailVerified) {
          setAlertVisible(true);
          setAlertMessage("please verify your email");
        } else {
          setAlertVisible(false);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div>
      <Head>
        <title>{process.env.NEXT_PUBLIC_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AlertBox
        visible={alertVisible}
        setVisible={setAlertVisible}
        type="bg-red-300"
        text={alertMessage}
      ></AlertBox>

      {/** Hero With Some Information*/}
      <div>
        <img
          className="-z-10 relative "
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            objectFit: "cover",
            height: "100%",
          }}
          src="/assets/images/mainPage/hero.svg"
        ></img>
        <div
          className=" flex justify-center  select-none content-center "
          style={{ height: "90vh" }}
        >
          <div className=" tracking-widest my-auto ">
            <p className="text-3xl lg:text-5xl bg-gray-800 p-4 text-white  font-black">
              {process.env.NEXT_PUBLIC_NAME}
            </p>
            <p className=" leading-relaxed text-center mt-10 text--2  bg-gray-800 text-white p-2">
              Build By <span className="text-primary-300  ">Gamers</span>{" "}
            </p>
            <p className=" leading-relaxed text-center mt-1 text--2  bg-gray-800 text-white p-2 ">
              For <span className="text-primary-300 ">Gamers</span>
            </p>
          </div>
        </div>

        <div className="flex justify-center absolute bottom-10 left-1/2 text--3">
          {<RiMouseLine></RiMouseLine>}
        </div>
      </div>
      {/* 
      Free To Play
      Win Prize
      get expoz
      get us to your campus
      become sponsor
    */}
      <div className="mx-3 mt-16 space-y-16">
        {/* For Free To Play */}
        <SimpleIconBox
          title={"Free To Play"}
          disc={`All Of The Tournament Organized By ${process.env.NEXT_PUBLIC_NAME} On Website Is Completely Free To Join.`}
          children={
            <Image
              src="/assets/images/mainPage/freetoplay.svg"
              width={150}
              height={150}
            ></Image>
          }
        ></SimpleIconBox>
        {/* For Rewards */}

        <SimpleIconBox
          title={"Win Rewards"}
          disc={`Compete on our platform & win exciting rewards and cash prize`}
          children={
            <Image
              src="/assets/images/mainPage/win.svg"
              width={150}
              height={150}
            ></Image>
          }
        ></SimpleIconBox>
        {/* For Teams */}
        <SimpleIconBox
          title={"Expanding Community"}
          disc={
            "Get Exposure You Need From Our Community To Become Professional Esports Player."
          }
          children={
            <Image
              src="/assets/images/mainPage/team.svg"
              width={150}
              height={150}
            ></Image>
          }
        ></SimpleIconBox>
        {/* For Campus */}
        <SimpleIconBox
          title={"On Your Campus"}
          disc={"Organize Esports Tournament At Your Campus."}
          children={
            <Image
              src="/assets/images/mainPage/campus.svg"
              width={150}
              height={150}
            ></Image>
          }
        ></SimpleIconBox>
        {/* For Sponsor */}
        <SimpleIconBox
          title={"Become Sponsor"}
          disc={"Support Our Platform By Sponsoring Us."}
          children={
            <Image
              src="/assets/images/mainPage/sponsor.svg"
              width={150}
              height={150}
            ></Image>
          }
        ></SimpleIconBox>
      </div>
      {/**Footer With Some Links And Information*/}
    </div>
  );
}

const SimpleIconBox = ({
  title,
  disc,
  children,
  callToAction,
}: {
  title: string;
  disc: string;
  children: JSX.Element;
  callToAction?: JSX.Element;
}) => {
  return (
    <div className=" text-black select-none ">
      <div>
        <div className="text-center my-auto">{children}</div>
        <div className="flex flex-col   text-center overflow-hidden">
          <p className="text-3xl  whitespace-normal overflow-hidden  p-1 px-4 mx-auto bg-gray-800 inline-block italic text-primary-500  font-bold tracking-wide mb-1">
            {title}
          </p>
          <div className="italic capitalize  tracking-tight">{disc}</div>
          {callToAction && <div>{callToAction}</div>}
        </div>
      </div>
    </div>
  );
};
