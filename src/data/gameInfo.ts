import { gameIds, MainGameData } from "./mainGameData";

const gameInfo: iGameInfo[] = [
  ...MainGameData.map((e) => {
    return {
      basicRulesFileName: e.gameId,
      discription: e.discription,
      gameId: e.gameId,
      name: e.gameName,
    } as iGameInfo;
  }),
];

export default gameInfo;

export interface iGameInfo {
  gameId: string;

  name: string;
  discription: string;
  basicRulesFileName: string;
}
