import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { iGameCard } from "../data/gamesCard";

export default function GameCard({
  imageURL,
  name,
  redirectName,
  shortName,
}: iGameCard) {
  useEffect(() => {
    //alert(shortName);
  });
  return (
    <Link href={`/games/${redirectName}`}>
      <div className="relative p-0 m-0 mb-3  btn overflow-hidden">
        <Image
          quality={50}
          src={`/assets/images/games/${imageURL}`}
          width={300}
          height={300 / 0.667}
        ></Image>
        <p className="max-h-full w-full whitespace-pre bg-primary-700 text-center -mt-2 hidden  lg:block text-base capitalize text-white   font-semibold">
          {name}
        </p>
        <p className="max-h-full w-full whitespace-pre bg-primary-700 text-center -mt-2 block lg:hidden  text-base capitalize text-white   font-semibold">
          {shortName}
        </p>
      </div>
    </Link>
  );
}
