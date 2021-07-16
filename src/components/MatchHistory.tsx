import { useState } from "react";
import { useEffect } from "react";
import { iParticipatedTournaments } from "../interfaces/iUser";
import router, { useRouter } from "next/router";
import { getGameDataById } from "../data/mainGameData";

export default function MatchHistory({
  data,
}: {
  data: iParticipatedTournaments[] | undefined;
}) {
  const router = useRouter();
  return (
    <div className=" bg-gray-800 mt-5  text-white p-2">
      <div className="text--2 mb-2 text-primary-500">Matches</div>
      {!data ? (
        <div className="text-center">Nothing To Show</div>
      ) : (
        <div>
          {data.map((e, idx) => {
            return (
              <MatchCard
                key={idx}
                gameId={e.gameId}
                tournamentId={e.tournamentId}
                tournamentName={e.tournamentName}
              ></MatchCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MatchCard({
  gameId,
  tournamentId,
  tournamentName,
}: iParticipatedTournaments) {
  return (
    <div
      className="cursor-pointer hover:border-primary-500 flex justify-between p-2 border-white border-2"
      onClick={(e) => router.push(`/tournament/${gameId}/${tournamentId}`)}
    >
      <div>{tournamentName}</div>
      <div>{getGameDataById(gameId)?.gameName}</div>
    </div>
  );
}
