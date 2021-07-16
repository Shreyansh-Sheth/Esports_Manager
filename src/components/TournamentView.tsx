import iTournament from "../interfaces/iTournament";
import Markdown from "./Markdown";
import { AiOutlineFlag, AiOutlineUserAdd } from "react-icons/ai";
import TournamentInfo from "./TournamentInfo";
import React, { useState } from "react";
import TournamentViewNav from "./TournamentViewNav";
import { viewSelected } from "../interfaces/iTournament";
import TournamentRule from "./TournamentRule";
import ParticipatesList from "./ParicipatesList";
import Support from "./Support";

import { useEffect } from "react";
import MatchView from "./MatchView";
import { auth, firestore } from "../config/firebaseConfig";
import GetUserRole from "../functions/GetUserRoles";

export default function TournamentView({
  data,
  children,
  gameId,
  tournamentId,
  registered,
}: {
  data: iTournament;
  tournamentId?: string;
  children: JSX.Element;
  gameId: string;
  registered: boolean;
}) {
  const [viewSelected, setViewSelected] = useState<viewSelected>("info");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [registeredInfo, setRegisteredInfo] = useState("");
  //Check For admin
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setIsAdmin(false);
      }
      if ((await GetUserRole()) === "admin") {
        setIsAdmin(true);
      }
    });
  });
  useEffect(() => {
    if (data.secretInformation) {
      setRegisteredInfo(data.secretInformation);
    }
  }, [data]);

  //Save Registered Information
  const save = () => {
    firestore
      .collection(`/games/${gameId}/tournaments`)
      .doc(tournamentId)
      .update({
        secretInformation: registeredInfo,
      });
  };
  return (
    <div className="md:mx-5 mx-2 mt-5">
      <div>
        <hr></hr>
        <p className="font-semibold">{data.gameName}</p>
        <div className="md:flex md:justify-between">
          <p className="text--2 capitalize font-bold  ">{data.name}</p>
          <div>
            Registrations:{`${data.participates}/${data.participationLimit}`}
          </div>
        </div>
        <hr></hr>
        <div className="md:flex md:justify-between">
          <div className="md:flex md:justify-left mt-5 ">
            <div className="flex md:justify-start justify-between bg-gray-800 text-white p-2 md:mr-5 mb-1 md:mb-0">
              <AiOutlineFlag className="text--2 my-auto text-primary-500 ml-3 md:ml-0"></AiOutlineFlag>
              <div className="mr-3 md:mr-0">
                <div className="text-center">Event Starts At</div>
                <div className=" text-right md:text-center">
                  {getDate(data.eventStartingDate)}
                </div>
              </div>
            </div>
            <div className="flex md:justify-start justify-between bg-gray-800 text-white p-2">
              <AiOutlineUserAdd className="text--2 my-auto text-primary-500 ml-3 md:ml-0"></AiOutlineUserAdd>
              <div className="mr-3 md:mr-0">
                <div className="text-center ">Registration Close At</div>
                <div className=" text-right md:text-center">
                  {getDate(data.participationCloseDate)}
                </div>
              </div>
            </div>
          </div>
          {children}
        </div>
        {((registered && data.secretInformation) || isAdmin) && (
          <div className="bg-gray-800  mt-5 pb-2 mb-2">
            <div className="text-primary-500 p-2 text--3">
              Joining Information
            </div>
            <Markdown
              hidden={!isAdmin}
              markdown={registeredInfo}
              markdownOnChange={setRegisteredInfo}
              dark={true}
            ></Markdown>
            {isAdmin && (
              <button className="btn--primary" onClick={save}>
                Save
              </button>
            )}
          </div>
        )}
        <TournamentViewNav
          ChangeView={setViewSelected}
          CurrentlySelected={viewSelected}
        ></TournamentViewNav>
        {data && viewSelected == "info" && (
          <TournamentInfo data={data}></TournamentInfo>
        )}
        {data && viewSelected == "Match" && (
          <MatchView
            tournamentData={data}
            tournamentId={tournamentId}
          ></MatchView>
        )}

        {data && viewSelected == "rules" && (
          <TournamentRule gameId={gameId} data={data}></TournamentRule>
        )}
        {data && viewSelected == "participations" && (
          <ParticipatesList
            showPoints={false}
            type={data.info.playerType === "solo" ? "solo" : "clan"}
            participates={data.participatesList}
          ></ParticipatesList>
        )}
        {data && viewSelected == "Support" && <Support></Support>}
      </div>
    </div>
  );
}

function getDate(date: number) {
  return `${new Date(date).getDate()}/${
    new Date(date).getMonth() + 1
  }/${new Date(date).getFullYear()}`;
}

function formatMoney(money: number) {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(money);
}
