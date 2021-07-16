import { useEffect } from "react";
import iTournament from "../interfaces/iTournament";
import Markdown from "./Markdown";
export default function TournamentInfo({ data }: { data: iTournament }) {
  return (
    <div>
      <div>
        <div className="bg-gray-800 text-white mt-5 p-2">
          <div className="text--3 text-primary-400 ">Tournament Info</div>
          <div className="mt-3">
            <div className={` ${data.prizePool > 0 ? "block" : "hidden"}`}>
              Prize Pool:
              <span className="font-semibold ml-2 capitalize">
                {formatMoney(data.prizePool)}
              </span>
            </div>
            <div>
              Game Mode:
              <span className="font-semibold ml-2 capitalize">
                {data.info.mode}
              </span>
            </div>
            <div>
              Format(Genral):
              <span className="font-semibold ml-2 capitalize">
                {data.info.format}
              </span>
            </div>
            <div>
              Player Type:
              <span className="font-semibold ml-2 capitalize">
                {data.info.playerType}
              </span>
            </div>
            <div>
              Coach:
              <span className="font-semibold ml-2 capitalize">
                {data.info.coach}
              </span>
            </div>

            <div>
              Overtime:
              <span className="font-semibold ml-2 capitalize">
                {data.info.overtime}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className=" bg-gray-800 mt-5 p-2 mb-5">
        <div className="text--3 text-primary-400 mb-3">Other Info</div>
        <Markdown hidden={true} dark={true} markdown={data.markdown}></Markdown>
      </div>
    </div>
  );
}

function formatMoney(money: number) {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(money);
}
