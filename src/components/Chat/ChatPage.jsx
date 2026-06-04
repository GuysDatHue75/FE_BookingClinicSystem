import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import apiClient from '../../api/api';
import styles from './ChatPage.module.css';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

const ChatPage = ({ onClose, targetDoctor }) => {
    const messageListRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inboxList, setInboxList] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [activeTab, setActiveTab] = useState('inbox');
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const currentUserId = localStorage.getItem('idAccount');
    const currentDoctorId = localStorage.getItem('idDoctor');
    const currentClinicId = JSON.parse(localStorage.getItem('user'));
    const currentRole = localStorage.getItem('role');

    
    const isDoctor = currentRole === 'BacSi' || !!currentDoctorId;

    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingSentRef = useRef(false);

    const selectedUserRef = useRef(selectedUser);
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // --- SỬA LỖI 1: GỘP VÀ SỬA DEPENDENCY ARRAY CHO ĐỒNG BỘ TARGET USER ---
    useEffect(() => {
        if (location.state?.targetPatient) {
            const patient = location.state.targetPatient;
            const accountChatId = patient.maBenhNhan.replace('BN', 'TK');
            setSelectedUser({
                maDoiPhuong: accountChatId,
                tenDoiPhuong: patient.hoVaTen,
                avatar: patient.avatar,
                role: "patient"
            });
            setActiveTab('patients');
        } else if (targetDoctor) {
            setSelectedUser({
                maDoiPhuong: targetDoctor.maTaiKhoan,
                tenDoiPhuong: targetDoctor.hoVaTen,
                avatar: targetDoctor.avatar,
                hocHam: targetDoctor.hocHam,
                chuyenKhoa: targetDoctor.chuyenKhoa,
                role: "doctor"
            });
            setActiveTab('inbox'); // Đảm bảo người dùng ở tab inbox để thấy lịch sử chat mới
        }
    }, [location.state, targetDoctor]); // Thêm targetDoctor vào dependencies

    const fetchInboxListOnly = async () => {
        if (!currentUserId) return;
        try {
            const res = await apiClient.get(`/api/v1/chat/inbox/${currentUserId}?page=0&size=20`);
            setInboxList(res.data.content || []);
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
        if (!messageListRef.current) return;
        messageListRef.current.scrollTo({
            top: messageListRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [messages, isTyping]);

    const handleSelectPatientNewChat = (patient) => {
        const accountChatId = patient.maBenhNhan.replace('BN', 'TK');
        setSelectedUser({
            maDoiPhuong: accountChatId,
            tenDoiPhuong: patient.hoVaTen,
            avatar: patient.avatar
        });
    };

    // --- SỬA LỖI 2: THÊM OPTIMISTIC UPDATE ĐỂ ĐƯA BÁC SĨ VÀO SIDEBAR NGAY KHI GỬI TIN ---
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

            const sentTime = new Date().toISOString();
            const renderedMsg = { ...newMsg, thoiGianGui: sentTime };

            setMessages(prev => [...prev, renderedMsg]);
            setMessageInput('');
            handleTypingStatus(false);
            isTypingSentRef.current = false;

            // Tiến hành cập nhật giao diện sidebar ảo ngay lập tức
            setInboxList(prevInbox => {
                const existingIndex = prevInbox.findIndex(item => item.maDoiPhuong === selectedUser.maDoiPhuong);

                const updatedItem = {
                    maDoiPhuong: selectedUser.maDoiPhuong,
                    tenDoiPhuong: selectedUser.tenDoiPhuong,
                    avatar: selectedUser.avatar,
                    tinNhanCuoi: newMsg.noiDung,
                    maNguoiGuiCuoi: currentUserId,
                    thoiGianCuoi: sentTime,
                    soTinChuaDoc: 0,
                    ...(existingIndex >= 0 ? prevInbox[existingIndex] : {}) // Giữ thuộc tính cũ nếu đã tồn tại
                };

                // Đè dữ liệu tin nhắn mới nhất
                updatedItem.tinNhanCuoi = newMsg.noiDung;
                updatedItem.maNguoiGuiCuoi = currentUserId;
                updatedItem.thoiGianCuoi = sentTime;

                if (existingIndex >= 0) {
                    // Nếu đã có, lọc bỏ vị trí cũ và đưa lên đầu danh sách lịch sử
                    const filtered = prevInbox.filter((_, idx) => idx !== existingIndex);
                    return [updatedItem, ...filtered];
                } else {
                    // Nếu chưa có (Chat mới từ nút Nhắn Tin), chèn thẳng vào đầu danh sách
                    return [updatedItem, ...prevInbox];
                }
            });

            // Tăng thời gian chờ lên 1000ms để database Backend kịp ghi nhận dữ liệu
            setTimeout(() => fetchInboxListOnly(), 1000);
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

    const handleCloseChat = () => {
        if (typeof onClose === 'function') {
            onClose();
        } else {
            navigate(-1);
        }
    };

    const filteredInbox = inboxList.filter(item =>
        item.tenDoiPhuong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.maDoiPhuong?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPatients = patientList.filter(item =>
        item.hoVaTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.maBenhNhan?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (location.pathname === "/chon-tinhthanh") {
        return null;
    }

    return (
        <>
            <div className={styles.modalOverlay} onClick={handleCloseChat}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h2>Hộp thư tư vấn trực tuyến</h2>
                        <button className={styles.closeModalBtn} onClick={handleCloseChat}>✕</button>
                    </div>

                    <div className={styles.chatLayout}>
                        <div className={styles.sidebar}>
                            <div className={styles.searchBar}>
                                <input
                                    type="text"
                                    placeholder={isDoctor ? "Tìm kiếm bệnh nhân, mã..." : "Tìm kiếm cuộc hội thoại..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className={styles.filterIcon}>🔍</span>
                            </div>

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

                        <div className={styles.chatWindow}>
                            {selectedUser ? (
                                <>
                                    <div className={styles.headerUser}>
                                        <img
                                            src={selectedUser.avatar || "https://via.placeholder.com/48"}
                                            alt="avt"
                                            className={styles.avatar}
                                        />
                                        <div className={styles.userInfo}>
                                            <h4>{selectedUser.tenDoiPhuong}</h4>
                                            {selectedUser.role === "doctor" && (
                                                <>
                                                    <p className={styles.doctorDegree}>{selectedUser.hocHam}</p>
                                                    <p className={styles.doctorSpecialty}>{selectedUser.chuyenKhoa}</p>
                                                </>
                                            )}
                                            <p className={styles.userId}>ID: {selectedUser.maDoiPhuong}</p>
                                        </div>
                                    </div>

                                    <div className={styles.messageList} ref={messageListRef}>
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