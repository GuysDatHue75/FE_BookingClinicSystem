import { useContext, useEffect, useRef } from "react";
import "./Introdution.css";
import bcg from "../../assets/image/backgroundBody3.webp";
import teamDocter from "../../assets/image/TeamDocter.png";
import { BookingHome } from "../../components/ButtonComponent/Button";
import { Advise } from "../../components/ButtonComponent/Button";
import ScrollReveal from "scrollreveal";
import { State } from "../../state/context";
import Loading from "../LoadingComponent/Loading";
const Introdution = () => {
  const imgDocterBody = useRef();
  const imgBody = useRef();
  const titleRef = useRef();
  const bookRef = useRef();
  const animation  = localStorage.getItem('animation' || false);
  const { loading, resetPage } = useContext(State);
  useEffect(() => {    
    const sr = ScrollReveal({
      origin: "top",
      distance: "300px",
      duration: "2500",
    });
    !animation && sr.reveal(imgDocterBody?.current, { origin: "left", delay: 400 });
    !animation && sr.reveal(imgBody?.current, { origin: "top" });
    !animation && sr.reveal(titleRef?.current, { delay: 600 });
    !animation && sr.reveal(bookRef?.current, { origin: "right", delay: 700 });
  }, []);
  return (
    <>
      {loading && (
        <div className="loading-main">
          <Loading />
        </div>
      )}
      {resetPage && (
        <div className="container-introdution">
          <div className="image-introdution" ref={imgBody}>
            <img src={bcg} className="backgoroundBody" />
          </div>
          <div className="wrapper-system">
            <img
              src={teamDocter}
              className="teamDocter-img"
              ref={imgDocterBody}
            />
            <div className="name-system">
              <h1 className="titile-home" ref={titleRef}>
                Hệ thống tư vấn và đặt lịch khám Online
              </h1>
              <div ref={bookRef} style={{marginTop:'20px'}}>
                <BookingHome path={"/phong-kham"}/>
                <Advise path={"/tu-van"}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Introdution;
