import { AppProps } from "next/app";
import { useEffect } from "react";
import { Fragment } from "react";
import Footer from "../src/components/footer";
import Navbar from "../src/components/Navbar";
import { auth } from "../src/config/firebaseConfig";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        auth.signInAnonymously();
      }
    });
  }, []);
  return (
    <Fragment>
      <div className=" min-h-screen">
        <Navbar></Navbar>
        <Component {...pageProps} />
      </div>
      <Footer></Footer>
    </Fragment>
  );
}

export default MyApp;
