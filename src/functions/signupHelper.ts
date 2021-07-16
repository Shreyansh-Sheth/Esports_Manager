import { auth } from "../config/firebaseConfig";
import firebase from "firebase/app";
import { addInitialDataToUserDoc } from "./addInitialDataToUserDoc";
export async function signinUserWithEmailPass({
  email,
  password,
  confirmPassword,
  nickname,
  Birthday,
}: {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  Birthday: firebase.firestore.Timestamp;
}): Promise<string | true | undefined> {
  //Email Checking
  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return "Please Insert Valid Email";
  }
  //nickname checkig
  if (nickname.length < 3 || nickname.length > 100) {
    return "please enter nickname between 3 and 20 charachters";
  }

  //Password  Checking
  if (password.length <= 6) {
    return "please enter password bigger than 6 character";
  }

  if (password !== confirmPassword) {
    return "password and confirm password does not match";
  }
  //Birthday checking
  if (Birthday.toDate() > new Date()) {
    return "Please Enter Valid Birthdate";
  }
  //Has To Be 18 Years Old
  if (!checkFor18(Birthday)) {
    return "You Are Must Be 18 Years Old";
  }
  try {
    const creds = await firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    const userCreds = await auth.currentUser?.linkWithCredential(creds);
    if (userCreds && userCreds.user) {
      userCreds.user?.updateProfile({
        displayName: nickname,
      });
      addInitialDataToUserDoc(Birthday, nickname, userCreds.user.uid);
      await userCreds.user.sendEmailVerification();
      return true;
    } else {
      return "there is some error";
    }
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      return "email is already exist";
    } else if (err.code === "auth/invalid-email") {
      return "Invalid Email";
    } else if (err.code === "auth/weak-password") {
      return "please enter password bigger that 6 character";
    }
    alert(err);
    return "There is some error ";
  }
}
function checkFor18(date: firebase.firestore.Timestamp) {
  var my_dob = date.toDate();
  var today = new Date();
  var max_dob = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  return max_dob.getTime() > my_dob.getTime();
}
