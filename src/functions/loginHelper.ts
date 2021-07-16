import { Router } from "next/dist/client/router";
import { auth } from "../config/firebaseConfig";

export async function loginWithEmailAndPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string | true | undefined> {
  //Email Checking
  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return "Please Insert Valid Email";
  }
  //Password  Checking
  if (password.length <= 6) {
    return "please enter valid password";
  }

  try {
    const user = await auth.signInWithEmailAndPassword(email, password);
    if (user) {
      return true;
    }
  } catch (err) {
    if (err.code == "auth/user-not-found") {
      return "user does not exist!";
    }
    return "invalid email or password";
  }
}
