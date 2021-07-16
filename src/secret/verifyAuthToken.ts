import { auth } from "./firebaseAdmin";

export default async function verifyToken(token: string) {
  if (!token) {
    return;
  }
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (e) {
    return;
  }
}
