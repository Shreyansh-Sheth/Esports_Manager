/*
Dataset Needed:
    -Games
    
Data To Show:
    -Game Name
    -Game Image
    -Tournaments Number (like 3 Tournament For This Game) 

Interaction:
    -Each Game Will Be Clickable (Redirect to ) => game/[id] => game/1
    
 */

import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import GameCard from "../../src/components/GameCard";
import gamesData from "../../src/data/gamesCard";

export default function Game() {
  return (
    <div className=" grid grid-flow-row lg:grid-cols-6 md:grid-cols-4 grid-cols-2 mt-5 mx-4 gap-4">
      {gamesData.map((e, i) => (
        <GameCard
          imageURL={e.imageURL}
          name={e.name}
          redirectName={e.redirectName}
          shortName={e.shortName}
          key={i}
        ></GameCard>
      ))}
    </div>
  );
}
