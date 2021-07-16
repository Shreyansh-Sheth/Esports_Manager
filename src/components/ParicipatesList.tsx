import { useEffect, useState } from "react";
import { iParticipate } from "../interfaces/iTournament";
import { useRouter } from "next/router";
import Image from "next/image";
import { getClanImageUrl } from "../functions/getClanImageUrl";
export default function ParticipatesList({
  participates,
  type,
  showPoints,
}: {
  showPoints: boolean;
  type: "solo" | "clan";
  participates: iParticipate[];
}) {
  return (
    <div className="bg-gray-800 text-white mt-3 p-2">
      <p className="text--2 text-primary-500">Participates</p>
      <div>
        {typeof participates == "undefined" || participates?.length === 0 ? (
          <p className="text-center">Participate To Appear Here</p>
        ) : (
          <div className="lg:grid lg:grid-cols-2">
            {participates.map((e, idx) => {
              return (
                <ParticipateBox
                  participate={e}
                  showPoints={showPoints}
                  type={type}
                  key={idx}
                ></ParticipateBox>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ParticipateBox({
  participate,
  type,
  showPoints,
}: {
  showPoints: boolean;
  type: "solo" | "clan";
  participate: iParticipate;
}) {
  const [imageUrl, setImageUrl] = useState(
    "/assets/images/clan_placeholder.png"
  );
  useEffect(() => {
    if (type == "clan" && participate.id) {
      getClanImageUrl(participate.id).then((data) => {
        setImageUrl(data);
      });
    }
  }, [participate.id]);

  const router = useRouter();
  return (
    <div
      onClick={(e) => {
        if (type == "solo") {
          router.push(`/profile/${participate.id}`);
        } else {
          router.push(`/clan/${participate.id}`);
        }
      }}
      className={`text-white overflow-ellipsis cursor-pointer hover:border-primary-600 transition-all duration-150 ease-in-out ${
        type === "solo" ? "lg:flex block" : "block"
      } justify-between md:mx-5 border-2 border-white p-2 mt-2`}
    >
      <div className="overflow-hidden">
        {type === "clan" && (
          <div className="flex justify-center">
            <Image src={imageUrl} width={128 / 2} height={128 / 2}></Image>
          </div>
        )}

        <p className="text--4 overflow-ellipsis whitespace-nowrap overflow-hidden  text-center">
          {participate.name}
        </p>
      </div>
      <div className="lg:hidden block">
        <hr className="mx-5"></hr>
      </div>
      <div className="text-center">
        {showPoints && <div>Points:{participate.points}</div>}
      </div>
    </div>
  );
}
