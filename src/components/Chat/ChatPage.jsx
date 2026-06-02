import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import apiClient from '../../api/api';
import styles from './ChatPage.module.css';
import Header from '../../layouts/LayoutsUser/Header/Header';
import { data } from 'react-router-dom';

const ChatPage = ({ onClose }) => {
    // State quản lý việc ẩn/hiện Modal chat
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [inboxList, setInboxList] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [activeTab, setActiveTab] = useState('inbox');
    const [searchTerm, setSearchTerm] = useState('');
    const role = localStorage.getItem("role");
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const currentUserId = localStorage.getItem('idAccount');
    const currentDoctorId = localStorage.getItem('idDoctor');
    const currentClinicId = JSON.parse(localStorage.getItem('user'));
    const currentRole = localStorage.getItem('role');

    // Kiểm tra chính xác vai trò Bác sĩ (loại trừ vai trò BenhNhan)
    const isDoctor = currentRole === 'BacSi' || !!currentDoctorId;

    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingSentRef = useRef(false);

    const selectedUserRef = useRef(selectedUser);
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    const fetchInboxListOnly = async () => {
        console.log(currentClinicId);
        
        if (!currentUserId) return;
        try {
            const res = await apiClient.get(`/api/v1/chat/inbox/${currentUserId}?page=0&size=20`);
            setInboxList(res.data.content || []);
            console.log(res.data.content);
            
        } catch (err) {
            console.error("Lỗi cập nhật danh sách inbox:", err);
        }
    };

    // WebSocket Connection
    useEffect(() => {
        if (!currentUserId) return;

        const socket = new SockJS('http://localhost:8080/ws-chat');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => { },
            onConnect: () => {
                console.log("Đã kết nối WebSocket thành công");

                client.subscribe(`/topic/messages/${currentUserId}`, (msg) => {
                    const newMsg = JSON.parse(msg.body);
                    if (selectedUserRef.current && newMsg.maNguoiGui === selectedUserRef.current.maDoiPhuong) {
                        setMessages(prev => [...prev, newMsg]);
                    }
                    fetchInboxListOnly();
                });

                client.subscribe(`/topic/typing/${currentUserId}`, (msg) => {
                    const data = JSON.parse(msg.body);
                    if (selectedUserRef.current && data.maNguoiGui === selectedUserRef.current.maDoiPhuong) {
                        setIsTyping(data.isTyping);
                    }
                });

                client.subscribe(`/topic/read/${currentUserId}`, (msg) => {
                    const data = JSON.parse(msg.body);
                    if (selectedUserRef.current && data.maNguoiNhan === currentUserId) {
                        fetchInboxListOnly();
                    }
                });
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) stompClient.current.deactivate();
        };
    }, [currentUserId]);

    useEffect(() => {
        fetchInboxListOnly();
    }, [currentUserId]);

    useEffect(() => {
        if (!isDoctor || !currentClinicId?.phongKham?.maPhongKham) return;
        const fetchPatients = async () => {
            
            try {
                const res = await apiClient.get(`/api/v1/patient/get-all?page=0&size=10&maBacSi=${currentDoctorId}&maPhongKham=${currentClinicId.phongKham.maPhongKham}`);
                console.log(res.data.content);
                setPatientList(res.data.content || []);
                
            } catch (err) {
                console.error("Lỗi lấy danh sách bệnh nhân:", err);
            }
        };
        fetchPatients();
    }, [currentDoctorId, currentClinicId, isDoctor]);

    useEffect(() => {
        if (!selectedUser) return;
        setIsTyping(false);

        const fetchHistory = async () => {
            try {
                const res = await apiClient.get(`/api/v1/chat/history/${currentUserId}/${selectedUser.maDoiPhuong}?page=0&size=50`);
                setMessages(res.data.content?.reverse() || []);

                await apiClient.post(`/api/v1/chat/read/${selectedUser.maDoiPhuong}/${currentUserId}`);

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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSelectPatientNewChat = (patient) => {
        const accountChatId = patient.maBenhNhan.replace('BN', 'TK');
        setSelectedUser({
            maDoiPhuong: accountChatId,
            tenDoiPhuong: patient.hoVaTen,
            avatar: patient.avatar
        });
    };

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

            const renderedMsg = { ...newMsg, thoiGianGui: new Date().toISOString() };
            setMessages(prev => [...prev, renderedMsg]);
            setMessageInput('');
            handleTypingStatus(false);
            isTypingSentRef.current = false;
            setTimeout(() => fetchInboxListOnly(), 300);
        }
    };

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

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
        if (!isTypingSentRef.current && stompClient.current?.connected && selectedUser) {
            isTypingSentRef.current = true;
            handleTypingStatus(true);
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            handleTypingStatus(false);
            isTypingSentRef.current = false;
        }, 2000);
    };

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

            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

                    {/* Thanh tiêu đề trên cùng của Modal */}
                    <div className={styles.modalHeader}>
                        <h2>Hộp thư tư vấn trực tuyến</h2>
                        <button className={styles.closeModalBtn} onClick={onClose}>✕</button>

                    </div>

                    <div className={styles.chatLayout}>
                        {/* --- CỘT TRÁI: SIDEBAR --- */}
                        <div className={styles.sidebar}>
                            <div className={styles.searchBar}>
                                <input
                                    type="text"
                                    placeholder={isDoctor ? "Tìm kiếm bệnh nhân, mã..." : "Tìm kiếm cuộc hội thoại..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className={styles.filterIcon}>&#128269;</span>
                            </div>

                            {/* CHỈ HIỂN THỊ THANH CHUYỂN TAB NẾU LÀ BÁC SĨ */}
                            {isDoctor && (
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
                            )}

                            <div className={styles.inboxList}>
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
                                                    <div className={styles.inboxItemHeader}>
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
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Chưa có cuộc hội thoại nào.</div>
                                    )
                                )}

                                {/* CHỈ HIỂN THỊ DANH SÁCH BỆNH NHÂN NẾU LÀ BÁC SĨ VÀ ĐANG CHỌN TAB PATIENTS */}
                                {isDoctor && activeTab === 'patients' && (
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
                                                        <div className={styles.inboxItemHeader}>
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
                                                                {msg.thoiGianGui ? new Date(msg.thoiGianGui).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} {isMe && '✓✓'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>Hãy gửi tin nhắn đầu tiên!</div>
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
                                <div className={styles.emptyChat}>Chọn một cuộc hội thoại để bắt đầu nhắn tin</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ChatPage;