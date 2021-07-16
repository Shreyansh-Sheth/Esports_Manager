/*
Dataset Needed:
  -Firebase Auth User (For Name And State Of user If is Login Or Not)

Interactions:
  -Simple Links To
      -Games
      -clan
      -Shop
      
    -If Not Login    
      -Login
      -Signup
    -If Login
      -Profile


Note:
  Make This Navbar responsive so if user open in mobile he will see dropown insted of direct links
*/

import { timeStamp } from "console";
import firebase from "firebase/app";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { User } from "react-feather";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { analytics, auth } from "../config/firebaseConfig";
import { addInitialDataToUserDoc } from "../functions/addInitialDataToUserDoc";
export default function Navbar() {
  const [user, setIsUser] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then(async (result) => {
        analytics.logEvent("login");
      })
      .catch((error) => {
        analytics.logEvent("fail_login", { error });
      });
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.isAnonymous) {
        setIsUser(false);
        return;
      }
      if (user) {
        setIsUser(true);
      } else {
        setIsUser(false);
      }
    });

    auth.onIdTokenChanged((user) => {
      if (!user?.isAnonymous && user) {
        setIsUser(true);
      }
    });
  }, []);

  const AvilForAllLinks = [
    <span
      onClick={(e) => {
        setSidebarOpen(false);
      }}
      className="nav-link "
      key="xasxas"
    >
      <Link href="/games">Games</Link>
    </span>,
  ];
  const NotAuthUserNav = [
    ...AvilForAllLinks,
    <button
      onClick={(e) => {
        setSidebarOpen(false);
        setModalVisible(true);
      }}
      key="btn login"
      className=" btn--primary btn--nav   flex text--4"
    >
      <span className="font-black ">Join</span>
    </button>,
  ];
  const userNav = [
    ...AvilForAllLinks,
    <span
      onClick={(e) => {
        setSidebarOpen(false);
      }}
      className="nav-link"
      key="sss"
    >
      <Link href="/clan">Clan</Link>
    </span>,
    <span
      onClick={(e) => {
        setSidebarOpen(false);
      }}
      className="nav-link"
      key="7777"
    >
      <Link href="/profile">Profile</Link>
    </span>,
    <button
      key="wq"
      className="btn--secondary btn--nav whitespace-nowrap"
      onClick={(e) => {
        setSidebarOpen(false);

        auth.signOut();
        auth.signInAnonymously();
        setIsUser(false);
        router.push("/");
      }}
    >
      Sign Out
    </button>,
  ];
  //
  //
  //
  return (
    <div className="   flex justify-between px-5 py-2 bg-white border-black border-solid border-2 shadow-right-offset ">
      <Link href="/">
        <span className="text--2 select-none text-primary-700 font-bold cursor-pointer self-center">
          {process.env.NEXT_PUBLIC_NAME}
        </span>
      </Link>
      <LoginModal
        MeVisible={modalVisible}
        setMeVisible={setModalVisible}
      ></LoginModal>
      {/*For Big Devices*/}
      <div className=" justify-evenly hidden  md:flex">
        {user ? (
          <Fragment>{userNav.map((E, i) => E)}</Fragment>
        ) : (
          <Fragment>{NotAuthUserNav.map((E, i) => E)}</Fragment>
        )}
      </div>
      {/*For Small Devices*/}
      <div className="justify-evenly  inline-block md:hidden">
        <AiOutlineMenu
          onClick={(e) => setSidebarOpen(true)}
          className="text-lg m-auto inline"
        ></AiOutlineMenu>
        {/**Side Nav */}
        <div
          className="bg-gray-800"
          style={{
            height: "100%",
            width: sidebarOpen ? "100%" : "0",
            position: "fixed",
            zIndex: 1,
            top: "0",
            left: "0",
            overflowX: "hidden",
            transition: "0.5s",
            paddingTop: "60px",
            textAlign: "center",
          }}
        >
          <AiOutlineClose
            className={"text-white"}
            onClick={(e) => {
              setSidebarOpen(false);
            }}
            style={{
              position: "absolute",
              top: "10px",
              right: "25px",
              fontSize: "36px",
              marginLeft: "50px",
            }}
          ></AiOutlineClose>
          {user ? (
            <Fragment>{userNav.map((e) => e)}</Fragment>
          ) : (
            <Fragment>{NotAuthUserNav.map((e) => e)}</Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

const LoginWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithRedirect(provider);
};

const LoginModal = ({
  MeVisible,
  setMeVisible,
}: {
  MeVisible: boolean;
  setMeVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={`fixed z-10  w-full h-full bg-transparent m-auto left-0 text-center overflow-auto pt-28 top-0 ${
        MeVisible ? "block" : "hidden"
      }`}
    >
      <div className="m-auto  w-10/12 text-center   px-10 py-5 items-center justify-center  text-black border  border-black shadow-right-offset cursor-auto bg-primary-200 ">
        <div className="font-black flex justify-end text--2">
          <AiOutlineClose
            onClick={(e) => {
              setMeVisible(false);
            }}
          ></AiOutlineClose>
        </div>
        <p>
          By Clicking This Button You Are Accepting To All Of Our{" "}
          <Link href="/termsandcondition">
            <span
              className="font-black cursor-pointer"
              onClick={(e) => {
                setMeVisible(false);
              }}
            >
              Terms And Condition
            </span>
          </Link>
        </p>
        <div>
          <button
            className="btn--primary flex mx-auto"
            onClick={(e) => {
              setMeVisible(false);
              LoginWithGoogle();
            }}
          >
            <FcGoogle className="text--3 mr-2"></FcGoogle>
            <p>Login With Google</p>
          </button>
        </div>
      </div>
    </div>
  );
};
