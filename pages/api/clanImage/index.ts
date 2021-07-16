import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { firestore } from "../../../src/secret/firebaseAdmin";
import verifyToken from "../../../src/secret/verifyAuthToken";
import iUser from "../../../src/interfaces/iUser";
import { storage } from "../../../src/secret/firebaseAdmin";
import { Stream } from "stream";
import sharp from "sharp";
const clanImage = nc<NextApiRequest, NextApiResponse>();
clanImage.post(async (req, res) => {
  const userData = await verifyToken(req.body.token);
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
  let userDocument: iUser;
  try {
    const userDoc = (await (
      await firestore.collection("/user").doc(userData.uid).get()
    ).data()) as iUser;
    const userIsAdmin =
      userDoc.clanData &&
      userDoc.clanData[0] &&
      userDoc.clanData[0].isAdmin &&
      userDoc.clanData[0].name === req.body.clanId;

    if (!userIsAdmin) {
      res.status(400);
      res.end();
      return;
    }
    userDocument = userDoc;
  } catch (e) {
   // console.log(e);
    res.status(400);
    res.end();
    return;
  }

  //File Formating
  try {
    //@ts-ignore
    const clanId = userDocument.clanData[0].name;

    const bucket = storage.bucket();

    const oldFile = bucket.file(`clanLogos/${clanId}.png`);
    if (await oldFile.exists()) {
      //console.log(oldFilep.metadata.timeCreated);
      const date = new Date(oldFile.metadata.timeCreated);
      if (Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
     //   console.log("Here");
        throw {
          err: true,
          message: "You Can Only Change This After 7 Days From Last Change",
        };
      }
    }

    const bufferStream = new Stream.PassThrough();
    const edit = sharp()
      .toFormat("png")
      .on("error", () => {
        throw "Invalid File Type";
      })
      .resize(128, 128, { width: 128, height: 128 })
      .png()
      .on("error", () => {
        throw "There Is Bad File Format";
      });

    bufferStream.end(req.body.image, "binary");

    const file = bucket.file(`clanLogos/${clanId}.png`);

    bufferStream
      .pipe(edit)
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: "image/png",
            cacheControl: "public,max-age=36000",
          },
        })
      )
      .on("finish", () => {
        res.send(200);
      })
      .on("error", () => {
       // console.log("Erro");
      });
  } catch (e) {
    if (e.err) {
   //   console.log(e);
      res.json(e);
      res.end();
      return;
    }
    res.status(400);
    res.end();
    return;
  }
});

export default clanImage;

/**
 *
 * 400 => Parameters Are Not right
 * 401 => Token is Not Correct
 *
 *
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500kb",
    },
  },
};
