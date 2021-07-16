import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";

const Modal: React.FC<iProps> = ({
  children,
  sucessText,
  failureText,
  onSuccess = () => {},
  onFailure = () => {},
  visible,
  showSucessAction = true,
  sucessActionPlaceHolder = "Aceept Above",
}) => {
  const [Mevisible, setMeVisible] = useState(false);
  useEffect(() => {
    setMeVisible(visible);
  }, [visible]);
  return (
    <div
      className={`fixed z-10  w-full h-full bg-transparent m-auto left-0 text-center overflow-auto pt-28 top-0 ${
        Mevisible ? "block" : "hidden"
      }`}
    >
      <div className="m-auto  w-10/12 text-center   px-10 py-5 items-center justify-center  text-black border  border-black shadow-right-offset cursor-auto bg-primary-200 ">
        {children}

        <div className="flex justify-evenly">
          {failureText && (
            <button onClick={onFailure} className="btn--secondary">
              {failureText}
            </button>
          )}

          {sucessText && (
            <button
              className={`btn--primary `}
              onClick={(e) => {
                if (showSucessAction) {
                  onSuccess();
                }
              }}
            >
              {showSucessAction ? sucessText : sucessActionPlaceHolder}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface iProps {
  sucessText?: string;
  failureText?: string;
  onSuccess?: () => void;
  onFailure?: () => void;
  visible: boolean;
  showSucessAction?: boolean;
  sucessActionPlaceHolder?: string;
}

export default Modal;
