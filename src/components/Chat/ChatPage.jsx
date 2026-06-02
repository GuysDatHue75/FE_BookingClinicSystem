import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import apiClient from '../../api/api';
import styles from './ChatPage.module.css';
import Header from '../../layouts/LayoutsUser/Header/Header';

const ChatPage = () => {
    const [inboxList, setInboxList] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [activeTab, setActiveTab] = useState('inbox');
    const [searchTerm, setSearchTerm] = useState('');
    const role = localStorage.getItem("role");
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Lấy thông tin tài khoản đăng nhập thực tế từ hệ thống
    const currentUserId = localStorage.getItem('idAccount');
    const currentDoctorId = localStorage.getItem('idDoctor') || 'BS001';
    const currentClinicId = localStorage.getItem('idClinic') || 'PK001';

    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingSentRef = useRef(false); // Ref chốt chặn để chống gửi spam tín hiệu typing liên tục

    // Dùng Ref để lưu trạng thái selectedUser giúp callback WebSocket luôn đọc được giá trị mới nhất
    const selectedUserRef = useRef(selectedUser);
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // Hàm lấy danh sách Hộp thư thoại cập nhật liên tục dữ liệu
    const fetchInboxListOnly = async () => {
        if (!currentUserId) return;
        try {
            const res = await apiClient.get(`/api/v1/chat/inbox/${currentUserId}?page=0&size=20`);
            setInboxList(res.data.content || []);
        } catch (err) {
            console.error("Lỗi cập nhật danh sách inbox:", err);
        }
    };

    // 1. Khởi tạo kết nối duy nhất và giữ mạch WebSocket
    useEffect(() => {
        if (!currentUserId) return;

        const socket = new SockJS('http://localhost:8080/ws-chat');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => { },
            onConnect: () => {
                console.log("Đã kết nối WebSocket thành công và giữ mạch");

                // --- KÊNH 1: NHẬN TIN NHẮN ---
                client.subscribe(`/topic/messages/${currentUserId}`, (msg) => {
                    const newMsg = JSON.parse(msg.body);

                    if (selectedUserRef.current && newMsg.maNguoiGui === selectedUserRef.current.maDoiPhuong) {
                        setMessages(prev => [...prev, newMsg]);
                    }
                    fetchInboxListOnly();
                });

                // --- KÊNH 2: NHẬN TÍN HIỆU ĐANG GÕ CHỮ ---
                client.subscribe(`/topic/typing/${currentUserId}`, (msg) => {
                    const data = JSON.parse(msg.body);
                    if (selectedUserRef.current && data.maNguoiGui === selectedUserRef.current.maDoiPhuong) {
                        setIsTyping(data.isTyping);
                    }
                });

                // --- KÊNH 3 (BỔ SUNG): NHẬN TÍN HIỆU ĐÃ XEM ---
                client.subscribe(`/topic/read/${currentUserId}`, (msg) => {
                    const data = JSON.parse(msg.body);
                    if (selectedUserRef.current && data.maNguoiNhan === currentUserId) {
                        fetchInboxListOnly(); // Cập nhật lại list để mất số tin nhắn chưa đọc
                    }
                });
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [currentUserId]);
    // 2. Tải danh sách hộp thư thoại ban đầu
    useEffect(() => {
        fetchInboxListOnly();
    }, [currentUserId]);

    // 3. Tải danh sách Bệnh nhân liên đới từ Backend hệ thống
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await apiClient.get(`/api/v1/patient/get-all?page=0&size=50&maBacSi=${currentDoctorId}&maPhongKham=${currentClinicId}`);
                setPatientList(res.data.content || []);
            } catch (err) {
                console.error("Lỗi lấy danh sách bệnh nhân từ hệ thống:", err);
            }
        };
        fetchPatients();
    }, [currentDoctorId, currentClinicId]);

    // 4. Đồng bộ hóa lịch sử hội thoại khi chuyển đổi người nhắn tin
    useEffect(() => {
        if (!selectedUser) return;
        setIsTyping(false); // Khởi tạo lại trạng thái gõ chữ

        const fetchHistory = async () => {
            try {
                const res = await apiClient.get(`/api/v1/chat/history/${currentUserId}/${selectedUser.maDoiPhuong}?page=0&size=50`);
                setMessages(res.data.content?.reverse() || []);

                // Đánh dấu toàn bộ tin nhắn từ phòng chat này đã được đọc
                await apiClient.post(`/api/v1/chat/read/${selectedUser.maDoiPhuong}/${currentUserId}`);

                // Phát tín hiệu thông báo đã xem thông tin qua Socket cho đối phương
                if (stompClient.current?.connected && selectedUser?.maPhongChat) {
                    stompClient.current.publish({
                        destination: '/app/chat/read',
                        body: JSON.stringify({ maNguoiGui: selectedUser.maDoiPhuong, maNguoiNhan: currentUserId, maPhongChat: selectedUser.maPhongChat })
                    });
                }
                fetchInboxListOnly();
            } catch (err) {
                console.error("Lỗi lấy lịch sử chat:", err);
                setMessages([]);
            }
        };
        fetchHistory();
    }, [selectedUser, currentUserId]);

    // 5. Tự động cuộn mượt màn hình xuống đáy khi có tin nhắn mới hoặc đang gõ chữ
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // 6. Xử lý lựa chọn Bệnh nhân mới từ danh sách hệ thống
    const handleSelectPatientNewChat = (patient) => {
        const accountChatId = patient.maBenhNhan.replace('BN', 'TK');
        setSelectedUser({
            maDoiPhuong: accountChatId,
            tenDoiPhuong: patient.hoVaTen,
            avatar: patient.avatar
        });
    };

    // 7. Hàm gửi tin nhắn qua kênh WebSocket bọc kết nối
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedUser) return;

        const newMsg = {
            maNguoiGui: currentUserId,
            maNguoiNhan: selectedUser.maDoiPhuong,
            noiDung: messageInput,
            loaiTinNhan: "TEXT"
        };

        if (stompClient.current?.connected) {
            stompClient.current.publish({
                destination: '/app/chat',
                body: JSON.stringify(newMsg)
            });

            // Gắn tạm thời thời gian hiển thị cục bộ tại giao diện để tăng trải nghiệm người dùng
            const renderedMsg = { ...newMsg, thoiGianGui: new Date().toISOString() };
            setMessages(prev => [...prev, renderedMsg]);
            setMessageInput('');

            // Tắt trạng thái đang gõ ngay sau khi bấm gửi
            handleTypingStatus(false);
            isTypingSentRef.current = false;

            setTimeout(() => fetchInboxListOnly(), 300);
        }
    };

    // 8. Hàm điều tiết gửi tín hiệu gõ chữ (Bảo mật băng thông tối đa)
    const handleTypingStatus = (typing) => {
        if (stompClient.current?.connected && selectedUser) {
            stompClient.current.publish({
                destination: '/app/chat/typing',
                body: JSON.stringify({
                    maNguoiGui: currentUserId,
                    maNguoiNhan: selectedUser.maDoiPhuong,
                    isTyping: typing
                })
            });
        }
    };

    // Xử lý thông tin khi người dùng gõ phím vào ô Input
    const handleInputChange = (e) => {
        setMessageInput(e.target.value);

        // Chỉ bắn tín hiệu ĐANG GÕ 1 lần duy nhất khi bắt đầu nhấn phím gõ từ rỗng
        if (!isTypingSentRef.current && stompClient.current?.connected && selectedUser) {
            isTypingSentRef.current = true;
            handleTypingStatus(true);
        }

        // Xóa bộ đếm thời gian trễ cũ nếu người dùng vẫn tiếp tục thao tác gõ chữ
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Sau 2 giây nếu người dùng không chạm phím nữa, tự động phát tín hiệu ngừng gõ chữ
        typingTimeoutRef.current = setTimeout(() => {
            handleTypingStatus(false);
            isTypingSentRef.current = false;
        }, 2000);
    };

    // --- LOGIC BỘ LỌC TÌM KIẾM ---
    const filteredInbox = inboxList.filter(item =>
        item.tenDoiPhuong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.maDoiPhuong?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPatients = patientList.filter(item =>
        item.hoVaTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.maBenhNhan?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
       {role == "BenhNhan" && <Header />}
        
        <div className={role == "BenhNhan" ? styles.chatContainerUser : styles.chatContainer}>
            <h1 className={styles.pageTitle}>Tin nhắn</h1>
            <div className={styles.chatLayout}>
                {/* --- CỘT TRÁI: SIDEBAR --- */}
                <div className={role == "BenhNhan" ? styles.sidebarUser : styles.sidebar}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm bệnh nhân, mã..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className={styles.filterIcon}>🔍</span>
                    </div>

                    <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                        <button
                            onClick={() => setActiveTab('inbox')}
                            style={{ flex: 1, padding: '10px', background: 'none', border: 'none', fontWeight: activeTab === 'inbox' ? 'bold' : 'normal', borderBottom: activeTab === 'inbox' ? '2px solid #007bff' : 'none', cursor: 'pointer' }}
                        >
                            Hộp thư ({filteredInbox.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('patients')}
                            style={{ flex: 1, padding: '10px', background: 'none', border: 'none', fontWeight: activeTab === 'patients' ? 'bold' : 'normal', borderBottom: activeTab === 'patients' ? '2px solid #007bff' : 'none', cursor: 'pointer' }}
                        >
                            Bệnh nhân ({filteredPatients.length})
                        </button>
                    </div>

                    <div className={styles.inboxList}>
                        {/* TAB 1: DANH SÁCH HỘP THƯ (ĐÃ CHAT) */}
                        {activeTab === 'inbox' && (
                            filteredInbox.length > 0 ? (
                                filteredInbox.map((inbox) => (
                                    <div
                                        key={`inbox_${inbox.maDoiPhuong}`}
                                        className={`${styles.inboxItem} ${selectedUser?.maDoiPhuong === inbox.maDoiPhuong ? styles.active : ''}`}
                                        onClick={() => setSelectedUser(inbox)}
                                    >
                                        <img src={inbox.avatar || "https://via.placeholder.com/48"} alt="avt" className={styles.avatar} />
                                        <div className={styles.inboxInfo}>
                                            <div className={styles.inboxHeader}>
                                                <h4>{inbox.tenDoiPhuong}</h4>
                                                <span className={styles.time}>
                                                    {inbox.thoiGianCuoi ? new Date(inbox.thoiGianCuoi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                            <div className={styles.inboxSnippet}>
                                                <p>{inbox.maNguoiGuiCuoi === currentUserId ? 'Bạn: ' : ''}{inbox.tinNhanCuoi}</p>
                                                {inbox.soTinChuaDoc > 0 && <span className={styles.unreadBadge}>{inbox.soTinChuaDoc}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Chưa có cuộc hội thoại nào. Gõ tìm kiếm hoặc qua tab Bệnh nhân nhé!</div>
                            )
                        )}

                        {/* TAB 2: DANH SÁCH BỆNH NHÂN */}
                        {activeTab === 'patients' && (
                            filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => {
                                    const mappedChatId = patient.maBenhNhan.replace('BN', 'TK');
                                    return (
                                        <div
                                            key={`patient_${patient.maBenhNhan}`}
                                            className={`${styles.inboxItem} ${selectedUser?.maDoiPhuong === mappedChatId ? styles.active : ''}`}
                                            onClick={() => handleSelectPatientNewChat(patient)}
                                        >
                                            <img src={patient.avatar || "https://via.placeholder.com/48"} alt="avt" className={styles.avatar} />
                                            <div className={styles.inboxInfo}>
                                                <div className={styles.inboxHeader}>
                                                    <h4>{patient.hoVaTen}</h4>
                                                    <span style={{ fontSize: '11px', color: '#007bff', background: '#e6f2ff', padding: '2px 6px', borderRadius: '10px' }}>
                                                        {patient.maBenhNhan}
                                                    </span>
                                                </div>
                                                <div className={styles.inboxSnippet}>
                                                    <p>SĐT: {patient.soDienThoai || 'Chưa cập nhật'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Không tìm thấy bệnh nhân nào hợp lệ.</div>
                            )
                        )}
                    </div>
                </div>

                {/* --- CỘT PHẢI: CHI TIẾT KHUNG CHAT --- */}
                <div className={styles.chatWindow}>
                    {selectedUser ? (
                        <>
                            {/* Header */}
                            <div className={styles.chatHeader}>
                                <div className={styles.headerUser}>
                                    <img src={selectedUser.avatar || "https://via.placeholder.com/48"} alt="avt" className={styles.avatar} />
                                    <div>
                                        <h4>{selectedUser.tenDoiPhuong}</h4>
                                        <p style={{ fontSize: '12px', color: '#666' }}>ID: {selectedUser.maDoiPhuong}</p>
                                    </div>
                                </div>
                                <button className={styles.moreOptions}>•••</button>
                            </div>

                            {/* Message List */}
                            <div className={styles.messageList}>
                                {messages.length > 0 ? (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.maNguoiGui === currentUserId;
                                        return (
                                            <div key={msg.maTinNhan || `msg_${idx}`} className={`${styles.messageWrapper} ${isMe ? styles.messageRight : styles.messageLeft}`}>
                                                {!isMe && <img src={selectedUser.avatar || "https://via.placeholder.com/32"} alt="avt" className={styles.messageAvatar} />}
                                                <div className={styles.messageContent}>
                                                    <div className={styles.bubble}>{msg.noiDung}</div>
                                                    <span className={styles.msgTime}>
                                                        {msg.thoiGianGui
                                                            ? new Date(msg.thoiGianGui).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                            : ''} {isMe && '✓✓'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện!</div>
                                )}

                                {isTyping && (
                                    <div className={`${styles.messageWrapper} ${styles.messageLeft}`}>
                                        <div className={styles.messageContent}>
                                            <div className={styles.bubbleTyping}>... Đối phương đang nhập văn bản</div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form className={styles.inputArea} onSubmit={handleSendMessage}>
                                <button type="button" className={styles.attachBtn}>📎</button>
                                <input
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    value={messageInput}
                                    onChange={handleInputChange}
                                />
                                <button type="submit" className={styles.sendBtn}>Gửi</button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.emptyChat}>Chọn một cuộc hội thoại hoặc bệnh nhân để bắt đầu nhắn tin</div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default ChatPage;