import { auth } from "../config/firebaseConfig";
import { userRoleType } from "../interfaces/iUser";

export default async function GetUserRole(): Promise<userRoleType> {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdTokenResult(true);

      if (token.claims.role) {
        return token.claims.role as userRoleType;
      } else {
        return "user";
      }
    } catch {
      return "not-user";
    }
  } else {
    return "not-user";
  }
}
