import * as admin from "firebase-admin";
const useEmulator = true;
try {
  let app = admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATEKEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} catch (e) {}
const storage = admin.app().storage();
const firestore = admin.app().firestore();
const auth = admin.app().auth();

export { auth, storage, firestore };
