import { useContext, useEffect, useRef, useState } from "react";
import "./IsLoginSucessfull.css";
import { Link } from "react-router-dom";
import ContentNotification from "../ContentNotificationComponent/ContentNotification";
import { State } from "../../state/context";
import apiClient from "../../api/api";
import { useNavigate } from "react-router-dom";
import avterr from "../../assets/image/user-avt.png"
const IsLoginSucessfull = () => {
  const [menuUser, setMenuUser] = useState(false);
  const [patient, setPatient] = useState();


  const { notifications, setNotifications, setTotalNotification,countCalender, setCountCalendar } = useContext(State);
  const { avatar, setAvatar, totalNotification} = useContext(State);
  const notificationRef = useRef();
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const idPatient = localStorage.getItem("idPatient");
 
  const idAccount = localStorage.getItem("idAccount");
  const handelSlideDown = () => {
    setMenuUser((prev) => !prev);
  };
  const handelNotification = () => {
    setNotifications((prev) => !prev);
  };

  useEffect(() => {
    const UserAPI = async () => {
      const reponse = await apiClient.get(`/api/v1/patient/${idPatient}`)
      const calendar = await apiClient.get(`/api/v1/c-calendar?id=${idPatient}`)
      
      setPatient(reponse.data);
      setCountCalendar(calendar.data);
      
      setAvatar(reponse.data.taiKhoan?.anhDaiDien);
      const responseTotalNoti = await apiClient.get(`/api/v1/c-notification?idAccount=${idAccount}&isRead=0`);
      setTotalNotification(responseTotalNoti.data);
    }
    UserAPI();
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuUser(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const HandelClickLogout = () => {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="container-islogin">
      <Link className="calenda-islogin" to={"/xem-lich-kham"}>
        Lịch khám của tôi
        {countCalender > 0 ? <span className="count-calendar">{ countCalender}</span> : '' }
      </Link>
      <div className="wrapper-notification-islogin" ref={notificationRef}>
        <i className="fa-regular fa-bell" onClick={handelNotification}></i>
        {totalNotification > 0 && <span className="quanlity-notification-islogin">{totalNotification}</span>}
        {notifications && <ContentNotification />}
      </div>
      <div className="wrapper-infor-islogin" ref={menuRef}>
        <img
          src={avatar || avterr}
          alt="avt"
          className="image-islogin"
          onClick={handelSlideDown}
        />
        {menuUser && (
          <div className="option-islogin">
            <div className="infor-user-islogin">
              <img src={avatar || avterr} alt="avt" className="image-islogin" />
              <div className="content-infor-user-islogin">
                <p>{patient?.taiKhoan.hoVaTen}</p>
                <p style={{ color: "#A8A8A8", marginTop: "5px" }}>
                  {patient?.taiKhoan.soDt ? patient?.taiKhoan.soDt : "...."}
                </p>
              </div>
            </div>
            <div className="option-user-islogin">
              <Link to={"/trang-ca-nhan"}>Hồ sơ của tôi</Link>
              <Link to={"/lich-su-kham-benh"}>Lịch sử khám bệnh</Link>
              <Link to={"/kham-lam-san"}>Khám lâm sàn - online</Link>
              <Link to={"/huong-dan-he-thong"}>Hướng dẫn sử dụng hệ thống</Link>

            </div>
            <div className="setting-user-islogin">
              <Link to={"/doi-mat-khau"}>Đổi mật khẩu</Link>
              <Link to={"/login"} onClick={HandelClickLogout}>Đăng xuất</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IsLoginSucessfull;
