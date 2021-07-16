import { Dispatch, SetStateAction, useEffect } from "react";
import { viewSelected } from "../interfaces/iTournament";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useState } from "react";

export default function TournamentViewNav({
  ChangeView,
  CurrentlySelected,
}: {
  ChangeView: Dispatch<SetStateAction<viewSelected>>;
  CurrentlySelected: viewSelected;
}) {
  //Determine Which Tabs Will we Availabe For Content
  useEffect(() => {}, []);

  const selectablesList: viewSelected[] = [
    "info",
    "Match",
    "participations",
    "rules",
    "Support",
  ];
  const [isDropdownActive, setDropDownActive] = useState(false);

  return (
    <div>
      <div className="sm:hidden h-auto  overflow-hidden">
        <div
          onClick={(e) => setDropDownActive(!isDropdownActive)}
          className="capitalize bg-gray-800 text-white p-2 flex justify-between box-border cursor-pointer select-none underline font-bold decoration-primary-400 text--4"
        >
          <p>{CurrentlySelected}</p>
          <div className="my-auto">
            {!isDropdownActive ? (
              <AiOutlineDown></AiOutlineDown>
            ) : (
              <AiOutlineUp></AiOutlineUp>
            )}
          </div>
        </div>

        <div
          className={`mt-1 bg-gray-800  border-2 border-primary-600 text-white ${
            isDropdownActive ? "block" : "hidden"
          }  `}
        >
          {selectablesList.map((e, idx) => (
            <div
              key={idx}
              className="p-2 whitespace-no-wrap text-center"
              onClick={(e) => setDropDownActive(false)}
            >
              <Slectables
                CurrentlySelected={CurrentlySelected}
                ChangeView={ChangeView}
                SlectableName={e}
              ></Slectables>
            </div>
          ))}
        </div>
      </div>
      <div className="sm:flex hidden  justify-evenly flex-shrink-0 md:justify-evenly p-2 flex-wrap  md:space-x-3 tracking-wide mt-5 bg-gray-800 text-white">
        {selectablesList.map((e, idx) => (
          <Slectables
            ChangeView={ChangeView}
            SlectableName={e}
            CurrentlySelected={CurrentlySelected}
            key={idx}
          ></Slectables>
        ))}
      </div>
    </div>
  );
}

function Slectables({
  ChangeView,
  CurrentlySelected,
  SlectableName,
}: {
  ChangeView: Dispatch<SetStateAction<viewSelected>>;
  CurrentlySelected?: viewSelected;
  SlectableName: viewSelected;
}) {
  return (
    <div
      onClick={(e) => ChangeView(SlectableName)}
      className={`capitalize box-border   cursor-pointer  select-none  ${
        SlectableName === CurrentlySelected
          ? "underline   font-bold "
          : "no-underline "
      }   decoration-primary-400 text--4`}
    >
      {SlectableName}
    </div>
  );
}
