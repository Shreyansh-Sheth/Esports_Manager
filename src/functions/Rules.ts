/*
Rules For Checking:
    -Age
    -Gamertag
    -Ban For That Game
    

*/

/// Has To provide age=18 in age and gamertag for gamename or banfor game for gamename
type rule =
  | { selector: "Age"; data: Number }
  | { selector: "GamerTag"; data: String }
  | { selector: "BanForGame"; data: String };

export default function ruleChecker(rule: rule): boolean {
  return false;
}

function age(): boolean {
  return false;
}
function Gamertag(): boolean {
  return false;
}
function banForGame(rule: String): boolean {
  return false;
}
