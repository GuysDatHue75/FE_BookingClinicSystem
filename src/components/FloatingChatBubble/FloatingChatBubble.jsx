import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FloatingChatBubble.module.css';

const FloatingChatBubble = () => {
    const navigate = useNavigate();

    // Lấy role hiện tại
    const role = localStorage.getItem("role");

    // Tùy chọn: Nếu chưa đăng nhập (không có role) hoặc là Admin thì không render bong bóng chat
    // Bỏ comment dòng dưới nếu sếp muốn ẨN bong bóng khi chưa đăng nhập
    // if (!role || (role !== "BacSi" && role !== "BenhNhan")) return null;

    const handleOpenChat = () => {
        if (role === "BacSi") {
            // Chuyển hướng cho Bác sĩ
            navigate('/doctor/chat');
        } else if (role === "BenhNhan") {
            // Chuyển hướng cho Bệnh nhân
            navigate('/patient/chat');
        } else {
            // Nếu chưa đăng nhập thì đẩy về trang login
            alert("Vui lòng đăng nhập để sử dụng tính năng nhắn tin!");
            navigate('/login');
        }
    }

    return (
        <div
            className={styles.chatBubbleContainer}
            onClick={handleOpenChat}
            title="Mở tin nhắn"
        >
            <div className={styles.chatIcon}>
                {/* SVG icon tin nhắn đơn giản */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            <span className={styles.badge}>3</span> {/* Số tin nhắn chưa đọc giả lập */}
        </div>
    );
};

export default FloatingChatBubble;