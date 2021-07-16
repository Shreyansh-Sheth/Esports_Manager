import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import gameInfo from "../data/gameInfo";
import ReadFile from "../functions/ReadFile";
import iTournament from "../interfaces/iTournament";
import Markdown from "./Markdown";

export default function TournamentRule({
  data,
  gameId,
}: {
  data: iTournament;
  gameId: string;
}) {
  const [gameRules, setGameRules] = useState<string>();
  const [genralRules, setGenralRules] = useState<string>();
  //Load Game Specific Rules
  useEffect(() => {
    const gameRuleFileName = gameInfo.find((e) => {
      if (e.gameId === gameId) {
        return true;
      }
      return false;
    })?.basicRulesFileName;

    ReadFile(gameRuleFileName as string)
      .then((data) => {
        setGameRules(data as string);
      })
      .catch((e) => {});
  }, []);
  //Load Genral Games Ruling
  useEffect(() => {
    ReadFile("generalRules")
      .then((data) => {
        setGenralRules(data as string);
      })
      .catch(() => {});
  }, []);
  return (
    <div>
      {data.tournamentRules && (
        <div className=" bg-gray-800 mt-5 p-2 mb-5">
          <div className="text--3 text-primary-400 mb-3">Tournament Rules</div>
          <Markdown
            hidden={true}
            dark={true}
            markdown={data.tournamentRules}
          ></Markdown>
        </div>
      )}
      {typeof gameRules === "string" && (
        <div className=" bg-gray-800 mt-5 p-2 mb-5">
          <div className="text--3 text-primary-400 mb-3">Game Rules</div>
          <Markdown hidden={true} dark={true} markdown={gameRules}></Markdown>
        </div>
      )}
      {typeof genralRules === "string" && (
        <div className=" bg-gray-800 mt-5 p-2 mb-5">
          <div className="text--3 text-primary-400 mb-3">General Rules</div>
          <Markdown hidden={true} dark={true} markdown={genralRules}></Markdown>
        </div>
      )}
    </div>
  );
}
