import { useContext, useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import styles from "./HeaderNotification.module.css";
import apiClient from "../../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { State } from "../../../state/context";
function HeaderNotification() {
    const idAccount = localStorage.getItem("idAccount");
    const [notifications, setNotifications] = useState();
    const { setShowNotification, setNotificationIndex } = useContext(State);
    const navigate = useNavigate();

    useEffect(() => {
        const getListNotification = async () => {
            const res = await apiClient.get(`/api/v1/notifications?id=${idAccount}`);
            setNotifications(res.data);
            console.log(res.data);

        }
        getListNotification();
    }, [])
    const handelClick = async (id) => {
        setShowNotification(false);
        await apiClient.put(
            `/api/v1/notification?idAccount=${idAccount}&idNoti=${id}`
        );
        const countRes = await apiClient.get(
            `/api/v1/c-notification?idAccount=${idAccount}&isRead=false`
        );

        setNotificationIndex(countRes.data);
        navigate(`/doctor/thong-bao/${id}`);
    }
    const handleDelete = async (idNoti) => {
        try {
            await apiClient.delete(
                `/api/v1/notification?idAccount=${idAccount}&idNoti=${idNoti}`
            );

            const res = await apiClient.get(
                `/api/v1/notifications?id=${idAccount}`
            );
            setNotifications(res.data);

            const countRes = await apiClient.get(
                `/api/v1/c-notification?idAccount=${idAccount}&isRead=false`
            );
            setNotificationIndex(countRes.data);

        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className={styles.notificationPanel}>

            <div className={styles.header}>
                <h2>Thông báo</h2>
            </div>
            <div className={styles.notificationList}>
                {notifications?.map((item) => (
                    <div onClick={() => handelClick(item.notification.maThongBao)} className={styles.notificationItem} key={item.id.maTaiKhoan}>
                        <img
                            src={item.notification.anhThongBao}
                            alt=""
                            className={styles.notificationImage}
                        />
                        <div className={item.isRead == true ? styles.notificationContentRead : styles.notificationContent}>
                            <p>{item.notification.tieuDe}</p>
                        </div>

                        <div className={styles.notificationAction}>
                            {!item.isRead && (
                                <span className={styles.unreadDot}></span>
                            )}

                            <button
                                className={styles.deleteBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.notification.maThongBao);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default HeaderNotification;