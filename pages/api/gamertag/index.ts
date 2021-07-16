import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { parseBody } from "next/dist/next-server/server/api-utils";
import { gameIds } from "../../../src/data/mainGameData";
import { isTagName } from "../../../src/functions/GamerTagHelper";
import { iGamerTagData } from "../../../src/interfaces/iGame";
import { firestore } from "../../../src/secret/firebaseAdmin";
import verifyToken from "../../../src/secret/verifyAuthToken";

const Gamertag = nc<NextApiRequest, NextApiResponse>();
Gamertag.post(async (req, res) => {
  const token = req.body.token;
  const gameId = req.body.gameId.trim() as string;
  const gamerTag = req.body.gamerTag.trim() as string;
  const tagLine = req.body.tagLine?.trim() as string | undefined;

  try {
    //Data checking
    if (
      typeof token !== "string" ||
      typeof gameId !== "string" ||
      typeof gamerTag !== "string"
    ) {
      res.status(400);
      res.end();
      return;
    }

    if (
      typeof tagLine === "string" &&
      tagLine.length > 50 &&
      tagLine.length < 1
    ) {
      res.status(400);
      res.end();
      return;
    }
    if (gamerTag.length > 50 && gamerTag.length < 2) {
      res.status(400);
      res.end();
      return;
    }

    if (
      typeof Object.entries(gameIds).find((e) => {
        if (e[1] === gameId) {
          return true;
        } else {
          return false;
        }
      }) === "undefined"
    ) {
      res.status(401);
      res.end();
      return;
    }

    //1 verify user
    const userData = await verifyToken(token);
    if (typeof userData === "undefined") {
      res.status(401);
      res.end();
      return;
    }
    if (userData.firebase.sign_in_provider === "anonymous") {
      res.status(401);
      res.end();
      return;
    }

    //2 ref to secret doc of user
    const userRef = firestore
      .collection(`/user/${userData.uid}/private`)
      .doc("gamertags");

    //3 get data if exist
    const gamerTagOldData = (await userRef.get()).data();

    //4 For New Players
    if (typeof gamerTagOldData === "undefined") {
      const newData: iGamerTagData = { gameId: gameId, gamerTag: gamerTag };
      if (isTagName(gameId)) {
        newData.tag = tagLine;
      }
      await userRef.create({
        gamerTags: [newData] as iGamerTagData[],
      });
      res.send(200);
      res.end();
      return;
    }
    //5 For Old Players

    const isNewGame = gamerTagOldData.gamerTags.find((e: iGamerTagData) => {
      if (e.gameId === gameId) {
        return true;
      } else {
        return false;
      }
    });
    //its brand new game
    if (typeof isNewGame === "undefined") {
      const newData: iGamerTagData = { gameId: gameId, gamerTag: gamerTag };
      if (isTagName(gameId)) {
        newData.tag = tagLine;
      }
      await userRef.set(
        {
          gamerTags: [...gamerTagOldData.gamerTags, newData],
        },
        { merge: true }
      );
      res.send(200);
      res.end();
      return;
    } else {
      //Its old game changing parameters
      const newData: iGamerTagData[] = gamerTagOldData.gamerTags.map(
        (e: iGamerTagData) => {
          if (e.gameId === gameId) {
            const newObj: iGamerTagData = {
              gameId: gameId,
              gamerTag: gamerTag,
            };

            if (isTagName(e.gameId)) {
              newObj.tag = tagLine;
            }
            return newObj;
          } else {
            return e;
          }
        }
      );
      await userRef.set({
        gamerTags: newData,
      });
    }
    //6 set data
  } catch (e) {
    res.send(400);
    res.end();
    return;
  }
  res.send(200);
  res.end();
  return;
});

export default Gamertag;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20kb",
    },
  },
};

/**
 *
 * 400 => Parameters Are Not right
 * 401 => Token is Not Correct
 *
 *
 */
