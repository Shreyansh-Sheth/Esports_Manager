import {
  FaFacebookSquare,
  FaDiscord,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="text-white bg-gray-800 p-2 mt-10 px-5   w-full  ">
      <div className="mb-3 flex justify-evenly  text-base mt-2 my-auto">
        <FaFacebookSquare className="my-auto"></FaFacebookSquare>
        <FaDiscord className="my-auto"></FaDiscord>
        <FaInstagram className="my-auto"></FaInstagram>
        <FaYoutube className="my-auto"></FaYoutube>
      </div>

      <div className="text-center text-base mb-2">
        All Right Reserved © {process.env.NEXT_PUBLIC_COMPANY_NAME}
      </div>
      <div className="flex justify-evenly text-xs lg:text-base">
        <Link href="/privacypolicy">Privacy Policy</Link>
        <Link href="/termsandcondition">Terms And Condition</Link>
      </div>
    </footer>
  );
}
