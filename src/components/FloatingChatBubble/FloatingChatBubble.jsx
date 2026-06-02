import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import apiClient from '../../api/api';
import ChatPage from '../Chat/ChatPage';
import styles from './FloatingChatBubble.module.css';

const FloatingChatBubble = () => {
    const navigate = useNavigate();
    // Lấy ra location để theo dõi đường dẫn URL hiện tại
    const location = useLocation();

    const role = localStorage.getItem("role");
    const currentUserId = localStorage.getItem('idAccount');

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const stompClient = useRef(null);

    const fetchTotalUnreadCount = async () => {
        if (!currentUserId) return null;
        try {
            const res = await apiClient.get(`/api/v1/chat/inbox/${currentUserId}?page=0&size=20`);
            const inboxList = res.data.content || [];
            const total = inboxList.reduce((sum, item) => sum + (item.soTinChuaDoc || 0), 0);
            setUnreadCount(total);
        } catch (err) {
            console.error("Lỗi lấy tổng số tin nhắn chưa đọc:", err);
        }
    };

    useEffect(() => {
        if (!currentUserId) return;
        fetchTotalUnreadCount();

        const socket = new SockJS('http://localhost:8080/ws-chat');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => { },
            onConnect: () => {
                client.subscribe(`/topic/messages/${currentUserId}`, () => { fetchTotalUnreadCount(); });
                client.subscribe(`/topic/read/${currentUserId}`, () => { fetchTotalUnreadCount(); });
            },
        });

        client.activate();
        stompClient.current = client;

        return () => { if (stompClient.current) stompClient.current.deactivate(); };
    }, [currentUserId]);

    useEffect(() => {
        if (!isChatOpen) { fetchTotalUnreadCount(); }
    }, [isChatOpen]);

    const handleOpenChat = () => {
        if (role === "BacSi" || role === "BenhNhan") {
            setIsChatOpen(true);
        } else {
            alert("Vui lòng đăng nhập để sử dụng tính năng nhắn tin!");
            navigate('/login');
        }
    };

    // Nếu URL hiện tại đang là '/login' hoặc các trang auth khác -> ẨN LUÔN
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage || !currentUserId || (role !== "BacSi" && role !== "BenhNhan")) {
        return null;
    }

    return (
        <>
            <div className={styles.chatBubbleContainer} onClick={handleOpenChat} title="Mở tin nhắn">
                <div className={styles.chatIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                {unreadCount > 0 && (
                    <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </div>

            {isChatOpen && <ChatPage onClose={() => setIsChatOpen(false)} />}
        </>
    );
};

export default FloatingChatBubble;