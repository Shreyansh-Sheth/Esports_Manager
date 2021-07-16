import { useEffect } from "react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { ImCross } from "react-icons/im";

export default function AlertBox({
  type,
  text,
  visible,
  setVisible,
}: {
  type: AlertType;
  text: String;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const [alertClassName, setAlertClassName] = useState<AlertType>("bg-red-300");
  useEffect(() => {
    if (type) {
      setAlertClassName(type);
    }
  }, [type]);
  useEffect(() => {
    if (visible) {
      window.scrollTo(0, 0);
    }
  }, [visible]);
  return (
    <Fragment>
      {visible ? (
        <div
          className={
            "mx-5  p-2 my-2 flex justify-between border-solid border-2 border-black " +
            alertClassName
          }
        >
          <span className="capitalize font-semibold tracking-wider	">
            {text}
          </span>
          <button className="bg-transparent" onClick={(e) => setVisible(false)}>
            <ImCross></ImCross>
          </button>
        </div>
      ) : (
        <Fragment></Fragment>
      )}
    </Fragment>
  );
}

type AlertType = "bg-red-300" | "bg-blue-300";
