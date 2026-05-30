import "./ContentNotification.css";
import { useContext, useEffect, useState } from "react";
import apiClient from "../../api/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ntf from "../../assets/image/ntf.jpg"
import { State } from "../../state/context";
const ContentNotification = () => {
  const idAccount = localStorage.getItem("idAccount");
  const { id: idNotiParam } = useParams();
  const [dataNotifications, setDataNotifications] = useState([]);
  const [path, setPath] = useState();
  const navigate = useNavigate();
  const location = useLocation();


  const { setTotalNotification } = useContext(State);
  const getNotifications = async () => {
    const res = await apiClient.get(`api/v1/notifications?id=${idAccount}`);
    setDataNotifications(res.data);
  }

  useEffect(() => {
    getNotifications();
    const path = location.pathname.split("/")[1];
    setPath(path);
  }, [])

  const getNumberNitification = async () => {
    const responseTotalNoti = await apiClient.get(`/api/v1/c-notification?idAccount=${idAccount}&isRead=0`);
    setTotalNotification(responseTotalNoti.data);
  }

  const handelReadNoti = async (idNoti) => {
    await apiClient.put(`/api/v1/notification?idAccount=${idAccount}&idNoti=${idNoti}`);
    navigate(`/thong-bao/${idNoti}`);
    getNumberNitification();
  }
  const handelDelNoti = async (idNoti) => {
    await apiClient.delete(`/api/v1/notification?idAccount=${idAccount}&idNoti=${idNoti}`);
    if (path === "trang-chu") {
      const responseTotalNoti = await apiClient.get(`/api/v1/c-notification?idAccount=${idAccount}&isRead=0`);
      const res = await apiClient.get(`api/v1/notifications?id=${idAccount}`);
      setDataNotifications(res.data);
      setTotalNotification(responseTotalNoti.data);
    } else {
      navigate("/trang-chu");
    }
  }
  return (
    <div className="container-ContentNotification">
      <h2 className="title-notification">Thông báo</h2>
      {dataNotifications.length > 0 ? dataNotifications.map((notification) => (
        <>
          {/* <p className="datatimeNotification">
            {new Date(notification.thoiGianGui)
              .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            {' '}
            {notification.thoiGianGui.slice(0, 10)}
          </p> */}
          <div className="itemNotifications"  >
            <div className="wrapper-notification" onClick={() => handelReadNoti(notification.notification.maThongBao)}>
              <img
                src={notification.notification.anhThongBao || ntf}
                alt={notification.notification.maThongBao}
                className="image-notification"

              />
              <p className={`content-notification ${notification.isRead == 0 ? "read-content-notification" : ""}`} onClick={() => handelReadNoti(notification.notification.maThongBao)}>{notification.notification.tieuDe}</p>
            </div>
            <div>
              <i class="fa-solid fa-xmark" onClick={() => handelDelNoti(notification.notification.maThongBao)}></i>
              {notification.isRead == 0 ? <span className="red-notifications"></span> : ""}
            </div>
          </div>
        </>
      )) : <p className="ntf-nonNoti">Hiện chưa có thông báo.</p>}
    </div>
  );
};

export default ContentNotification;
