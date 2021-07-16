export interface iMainGameData {
  gameId: string;
  gameName: string;
  discription: string;
  shortName: string;
}

export const gameIds = {
  valorant: "valorant",
  rocketLeague: "rocketleague",
  leagueOfLegends: "leagueoflegends",
  battlegroundsMobileIndia: "battlegroundsmobileindia",
};

export const MainGameData: iMainGameData[] = [
  {
    gameId: gameIds.valorant,
    gameName: "Valorant",
    discription: "5v5 Tactical Shooter",
    shortName: "Valorant",
  },
  {
    gameId: gameIds.rocketLeague,
    gameName: "Rocket League",
    discription: "Cars Playing Football",
    shortName: "Rocket League",
  },
  {
    gameId: gameIds.leagueOfLegends,
    gameName: "League Of Legends",
    discription: "MOBA",
    shortName: "LOL",
  },
  {
    gameId: gameIds.battlegroundsMobileIndia,
    gameName: "Battlegrounds Mobile",
    discription: "Battleroyal",
    shortName: "BGMI",
  },
];

export function getGameDataById(id: string) {
  return MainGameData.find((e) => {
    if (e.gameId === id) {
      return true;
    } else {
      false;
    }
  });
}
