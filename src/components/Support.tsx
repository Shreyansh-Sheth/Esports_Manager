import { memo, useEffect, useState } from "react";
import ReadFile from "../functions/ReadFile";
import Markdown from "./Markdown";

function Support({}: {}) {
  const [supportInfo, setSupportInfo] = useState<string>();

  //Load General Games Ruling
  useEffect(() => {
    ReadFile("support", "/assets/")
      .then((data) => {
        setSupportInfo(data as string);
      })
      .catch(() => {});
  }, []);
  return (
    <div>
      {typeof supportInfo === "string" && (
        <div className=" bg-gray-800 mt-5 p-2 mb-5">
          <div className="text--3 text-primary-400 mb-3">Game Rules</div>
          <Markdown hidden={true} dark={true} markdown={supportInfo}></Markdown>
        </div>
      )}
    </div>
  );
}

export default memo(() => <Support></Support>);
