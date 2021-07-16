import head from "next/head";
import router from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import {
  iTournamentIndex,
  tournamentStatusType,
} from "../interfaces/iTournament";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";

export default function TournamentList({
  heading,
  tournamentIndexList,
  gameNameId,
}: {
  gameNameId: string;
  heading: "Currently Running" | "Open For Regestration" | "Ended" | "Private";
  tournamentIndexList: iTournamentIndex[] | undefined;
}) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (heading === "Ended") {
      setHidden(true);
    }
  }, []);
  return (
    <div className="bg-gray-800 text-white border-primary-900 p-2 mt-3 mx-2">
      <div className="flex justify-between">
        <div className="text--3 ">{heading}</div>

        {heading === "Ended" && (
          <div className="my-auto" onClick={() => setHidden(!hidden)}>
            {hidden ? (
              <AiOutlineDown className="m-auto text-center"></AiOutlineDown>
            ) : (
              <AiOutlineUp></AiOutlineUp>
            )}
          </div>
        )}
      </div>
      {!hidden && (
        <>
          <hr className="bg-primary-500 h-1"></hr>
          <div className="mt-5">
            {typeof tournamentIndexList === "undefined" ? (
              <div className="text-center text--5">Loading...</div>
            ) : tournamentIndexList.length === 0 ? (
              <div className="text-center text--5">Nothing To Show</div>
            ) : (
              <div>
                <div className="md:flex hidden text-white  justify-between btn border-none text--5 mb-3 box-shadow-none">
                  <div>Name</div>
                  <div
                    className={`${
                      heading === "Ended" || heading === "Private"
                        ? "hidden"
                        : "block"
                    }`}
                  >
                    {heading === "Open For Regestration"
                      ? "Register Before"
                      : "Tournament Starts At"}
                  </div>
                </div>
                {tournamentIndexList
                  .sort((a, b) => {
                    if (heading === "Open For Regestration") {
                      return a.registrationEndDate > b.registrationEndDate
                        ? -1
                        : 0;
                    }
                    return a.matchStartDate > b.matchStartDate ? -1 : 0;
                  })
                  .map((e, idx) => {
                    return (
                      <div
                        onClick={() => {
                          if (heading === "Private") {
                            router.push(
                              `/admin/tournament/[name]/[id]`,
                              `/admin/tournament/${gameNameId}/${e.id}`
                            );
                          } else {
                            router.push(
                              "/tournament/[name]/[id]",
                              `/tournament/${gameNameId}/${e.id}`
                            );
                          }
                        }}
                        key={idx}
                        className="md:flex text-white bg-primary-700 transition duration-200 ease-in justify-between btn hover:bg-primary-800 focus:bg-primary-800 text--5 mb-3 box-shadow-none"
                      >
                        <div>{e.name}</div>
                        <div>
                          <div
                            className={`${
                              heading === "Ended" ? "hidden" : "block"
                            }`}
                          >
                            {heading !== "Ended" && (
                              <span className="md:hidden">
                                {heading === "Open For Regestration"
                                  ? "Register Before"
                                  : "Tournament Starts At"}
                                :
                              </span>
                            )}

                            {heading === "Open For Regestration"
                              ? `${new Date(
                                  e.registrationEndDate
                                ).toDateString()}`
                              : `${new Date(e.matchStartDate).toDateString()}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
