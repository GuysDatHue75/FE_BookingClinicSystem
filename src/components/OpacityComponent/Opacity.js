import { useContext, useEffect, useCallback } from "react";
import "./Opacity.css";
import { State } from "../../state/context";

const Opacity = ({ mobileRef, setMobile, booking }) => {
  const { valueText, setValueText } = useContext(State);

  const handleClickOpacity = useCallback(() => {
    if (mobileRef?.current) {
      mobileRef.current.style.transform = "translateX(100%)";
      setMobile(false);
    }
    setValueText("");
  }, [setValueText]);

  useEffect(() => {
    const scroll = document.body.style.overflow;
    document.body.style.overflow = valueText ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = scroll;
    };
  }, [valueText]);

  return <div className={`${booking ? "container-opacity-booking" : "container-opacity"}`} onClick={handleClickOpacity}></div>;
};

export default Opacity;
