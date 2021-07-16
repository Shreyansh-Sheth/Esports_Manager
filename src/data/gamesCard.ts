import { MainGameData } from "./mainGameData";
const gamesData: iGameCard[] = [
  ...MainGameData.map((e) => {
    return {
      name: e.gameName,
      imageURL: e.gameId + ".jpg",
      redirectName: e.gameId,
      shortName: e.shortName,
    } as iGameCard;
  }),
];

export default gamesData;

export interface iGameCard {
  name: string;
  imageURL: string;
  redirectName: string;
  shortName: string;
}
