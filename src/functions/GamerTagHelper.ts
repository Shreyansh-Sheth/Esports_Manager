import { gameIds } from "../data/mainGameData";

export const isTagName = (id: string) => {
  return tagWithTag.includes(id);
};
export const getExtraInfo = (id: string) => {
  const extraInfo = ExtraInfo.find((e) => {
    if (e.gameId === id) {
      return true;
    }
    return false;
  });
  if (extraInfo) {
    return extraInfo;
  } else {
    return false;
  }
};

//List Of game Accepts Gamer Tag With Tag
export const tagWithTag = [gameIds.valorant, gameIds.leagueOfLegends];
//List Of Games Accepts Only Gamer Tag
export const tagOnly = [gameIds.battlegroundsMobileIndia, gameIds.rocketLeague];

//Extra Info(like some specific gamertag)
export const ExtraInfo: extraInfoType[] = [
  {
    gameId: gameIds.rocketLeague,
    info: "Console Players Add Your Epic Id",
  },
];

export type extraInfoType = {
  info: string;
  gameId: string;
};
