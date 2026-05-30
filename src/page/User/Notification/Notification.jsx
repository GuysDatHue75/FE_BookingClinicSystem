import React, { useState, useEffect, useContext } from "react";
import "./Notification.css";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../api/api";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import { State } from "../../../state/context";

const NotificationDetail = () => {
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { notifications, setNotifications } = useContext(State)
    const navigate = useNavigate();

    const { id: idNotification } = useParams();

    useEffect(() => {
        setNotifications(false);
        const getNotification = async () => {
            try {
                const res = await apiClient.get(
                    `api/v1/notification?id=${idNotification}`
                );

                setNotification(res.data.notification);
            } catch (err) {
                console.error("Lỗi lấy thông báo:", err);
            } finally {
                setLoading(false);
            }
        };

        if (idNotification) {
            getNotification();
        }
    }, [idNotification]);

    const formatDateTime = (s) => {
        if (!s) return "";
        return (
            new Date(s).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            }) +
            " " +
            s.slice(0, 10)
        );
    };

    if (loading) {
        return <div className="loading">Đang tải thông báo...</div>;
    }

    if (!notification) {
        return (
            <>
                <Header />
                <div className="error">Không tìm thấy thông báo.</div>;
            </>)
    }

    return (
        <>
            <Header />
            <div className="notification-page">
                <div className="notification-container">
                    <div className="notification-header">
                        <h1 className="notification-title">
                            {notification.tieuDe}
                        </h1>
                        <p className="notification-time">
                            {formatDateTime(notification.thoiGianGui)}
                        </p>
                    </div>

                    <div className="divider"></div>

                    <div className="notification-content">
                        {notification.noiDung
                            ?.split("\n")
                            .map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                    </div>
                    {notification.files && <div>
                        <a href={notification.files} target="_blank" rel="noopener noreferrer">Nội dung file đính kèm tại đây.</a>
                    </div>}

                    <div className="notification-actions">
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate(-1)}
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationDetail;