/**
 * Data I Need :
 * token
 * tournament id
 * clan i want to join with
 *
 * =>what to check
 *  0. chack for token ✅
 *  1. check is tournament exist✅
 *  2. chak if tournament is full✅
 *  3. check if clan has enough peoples based on tournament✅
 *  4. check if all member have their game id set✅
 *  5. send notification ✅
 *
 *
 *
 * => what to do
 *  0. add tournament info to clan
 *  1. add tournament info to all players profile
 *  2. add tournament info to tournament
 *  3. commit all changes
 */

import { firestore as fires } from "firebase-admin";

import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { iClan } from "../../../../src/interfaces/iClan";
import { iGamerTagData } from "../../../../src/interfaces/iGame";
import iTournament, {
  playerType,
} from "../../../../src/interfaces/iTournament";
import { iParticipatedTournaments } from "../../../../src/interfaces/iUser";
import { firestore } from "../../../../src/secret/firebaseAdmin";
import verifyToken from "../../../../src/secret/verifyAuthToken";
const TournamentRegistarHandler = nc<NextApiRequest, NextApiResponse>();

TournamentRegistarHandler.post(async (req, res) => {
  const token = req.body.token;
  const gameId = req.body.gameId;
  const tournamentId = req.body.tournamentId;
  const clanId = req.body.clanId;

  //Data checking
  if (
    typeof token !== "string" ||
    typeof tournamentId !== "string" ||
    typeof gameId !== "string"
  ) {
    res.status(400);
    res.end();
    return;
  }

  //1
  const userData = await verifyToken(token);
  if (typeof userData === "undefined") {
    res.status(403);
    res.end();
    return;
  }

  if (userData.firebase.sign_in_provider === "anonymous") {
    res.status(403);
    res.end();
    return;
  }

  const tournamentRef = firestore
    .collection(`/games/${gameId}/tournaments/`)
    .doc(tournamentId);

  //Run Transaction For Work We Have To Do

  try {
    await firestore.runTransaction(async (transaction) => {
      const tournamentDoc = (await transaction.get(tournamentRef)).data() as
        | iTournament
        | undefined;
      if (!tournamentDoc) {
        throw "No Document Found";
      }
      if (tournamentDoc.participationCloseDate < Date.now()) {
        throw "Registration Time Is Over";
      }
      //Check if already register for tournament
      if (tournamentDoc.info.playerType === "solo") {
        tournamentDoc?.participatesList?.map((e) => {
          if (e.id === userData.uid) {
            throw "You Have Already Registered For This Tournament";
          }
        });
      }
      //Check If Tournament Is Full Or Not
      if (tournamentDoc.participates >= tournamentDoc.participationLimit) {
        throw "Tournament Is Full";
      }
      if (tournamentDoc.info.playerType == "solo") {
        /*
        DO SOMETHING FOR SOLO PLAYERS 
       */

        //check if player has gamertag for that game
        const hasGamerTag = await checkForGamerTag(
          userData.uid,
          tournamentDoc.gameId,
          transaction
        );
        if (!hasGamerTag) {
          throw "you don't have gamertag setup for this game set gamertag GOTO Profile -> Manage Gamertags";
        }
        //Add That Player to tournament

        //1. increse counter on tournament doc
        //2. add participation data to that doc
        transaction.update(tournamentRef, {
          participates: fires.FieldValue.increment(1),
          participatesList: fires.FieldValue.arrayUnion({
            name: userData["name"],
            id: userData.uid,
            points: 0,
          }),
        });

        //
        //Change user doc
        // add tournament data to user doc
        // add notification
        const userDocRef = firestore.collection("user").doc(userData.uid);
        transaction.set(
          userDocRef,
          {
            notifications: fires.FieldValue.arrayUnion(
              `You Are Participated In Tournament ${tournamentDoc.name}.`
            ),
            participatedTournaments: fires.FieldValue.arrayUnion({
              tournamentId: tournamentId,
              tournamentName: tournamentDoc.name,
              gameId: tournamentDoc.gameId,
            } as iParticipatedTournaments),
          },
          { merge: true }
        );

        res.json({
          Error: false,
          Message: "You Have Been Sucessfully Registered For Tournament",
        });
        res.end();
      } else {
        /**
         * All Clan Registration Happens Here
         */
        if (checkIfAlreadyRegistered(tournamentDoc, clanId)) {
          throw "Already Registered";
        }
        const clanRef = firestore.collection(`/clan`).doc(clanId);
        const clanDoc = (await (
          await transaction.get(clanRef)
        ).data()) as iClan;
        /*
        DO SOMETHING FOR CLAN PLAYERS
        */
        //check if player requesting is clan admin or not
        if (clanDoc.clanLeaderId !== userData.uid) {
          throw "You Are Not The Leader Of This Clan";
        }
        //
        //1 Check For Enough Players
        //

        if (
          clanDoc.members.length <
          getNeededPlayerNumber(tournamentDoc.info.playerType)
        ) {
          throw "Clan Has No Enough Member (Add Members To Clan)";
        }

        //2 Loop Through players To Find If Some Player does not have gamertag associted to them
        //

        for (let i = 0; i < clanDoc.members.length; i++) {
          //Add Call For Function to check For Member gamerId Tag Chack
          const member = clanDoc.members[i];
          //   console.log(member);
          if (
            (await checkForGamerTag(
              member.id,
              tournamentDoc.gameId,
              transaction
            )) === false
          ) {
            throw "Some Of Your Clan Members Have Not Set Gamertag For This Game";
          }
        }

        //Adding Clan To Tournament
        transaction.update(tournamentRef, {
          participates: fires.FieldValue.increment(1),
          participatesList: fires.FieldValue.arrayUnion({
            name: clanDoc.clanName,
            id: clanId,
            points: 0,
          }),
        });

        //Adding Notification To Clan That You Joined Tournament
        transaction.set(
          clanRef,
          {
            participatedTournaments: fires.FieldValue.arrayUnion({
              tournamentId: tournamentId,
              tournamentName: tournamentDoc.name,
              gameId: tournamentDoc.gameId,
            } as iParticipatedTournaments),
            notifications: fires.FieldValue.arrayUnion(
              `You Have Been Sucessfully Registered With ${tournamentDoc.name} Tournament.`
            ),
          },
          { merge: true }
        );
        res.json({
          Error: false,
          Message: "You Have Been Sucessfully Registered For Tournament",
        });
        res.end();
      }
    });
  } catch (e) {
    // console.log(e.code);
    console.log(e);
    res.json({ Error: true, Message: e });
    res.end();
    return;
  }
  return;
});

export default TournamentRegistarHandler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10kb",
    },
  },
};

/**
 * @async
 * @param playerId
 * @param gameId
 * @description Returns True Or False Based On Player has Gamerid for specific game
 */
async function checkForGamerTag(
  playerId: string,
  gameId: string,
  transaction: FirebaseFirestore.Transaction
): Promise<boolean> {
  //Get Data For Specific User Document
  const userPrivateRef = firestore
    .collection(`user/${playerId}/private`)
    .doc("gamertags");
  const GamertagData = await (await transaction.get(userPrivateRef)).data();
  if (!GamertagData || !GamertagData.gamerTags) {
    return false;
  }

  //Check For Partiqular game
  const allTags = GamertagData.gamerTags as unknown as iGamerTagData[];
  for (let i = 0; i < allTags.length; i++) {
    if (allTags[i].gameId === gameId) {
      return true;
    }
  }
  //AfterThat Check If gamertag and tag are there
  return false;
}
function getNeededPlayerNumber(playerType: playerType) {
  if (playerType === "3 man squad") {
    return 3;
  }
  if (playerType === "4 man squad") {
    return 4;
  }
  if (playerType === "duo") {
    return 2;
  }
  if (playerType === "solo") {
    return 1;
  }
  if (playerType == "team") {
    return 5;
  }
  return 5;
}

function checkIfAlreadyRegistered(tournamentDoc: iTournament, id: string) {
  if (!tournamentDoc.participatesList) {
    return;
  }
  const ans = tournamentDoc.participatesList.find((e) => {
    if (e.id === id) {
      return true;
    }
  });
  if (ans) {
    return true;
  }
  return false;
}

/**
 *
 * 400 => Parameters Are Not right
 * 401 => Token is Not Correct
 * 403 => Forbidder (not able to authorize it)
 */
