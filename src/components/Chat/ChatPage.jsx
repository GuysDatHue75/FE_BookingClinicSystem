import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import apiClient from '../../api/api';
import styles from './ChatPage.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ChatPage = ({ onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [inboxList, setInboxList] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [activeTab, setActiveTab] = useState('inbox');
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // Trạng thái khi đang upload file


    const currentUserId = localStorage.getItem('idAccount');
    const currentDoctorId = localStorage.getItem('idDoctor');
    const currentClinicId = JSON.parse(localStorage.getItem('user'));
    const currentRole = localStorage.getItem('role');
    const isDoctor = currentRole === 'BacSi' || !!currentDoctorId;

    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingSentRef = useRef(false);
    const fileInputRef = useRef(null); // Ref điều khiển input file ẩn

    const selectedUserRef = useRef(selectedUser);

    // Cập nhật ref để tránh hiện tượng closure trong sự kiện lắng nghe WebSocket
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    useEffect(() => {
        if (location.state?.targetPatient) {
            const patient = location.state.targetPatient;
            const accountChatId = patient.maBenhNhan.replace('BN', 'TK');

            setSelectedUser({
                maDoiPhuong: accountChatId,
                tenDoiPhuong: patient.hoVaTen,
                avatarDoiPhuong: patient.avatar // Đồng bộ trường avatar từ DTO mới
            });

            setActiveTab('patients');
        }
    }, [location.state]);

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

                    // Nếu tin nhắn nhận được là từ người ĐANG CHỌN CHAT
                    if (selectedUserRef.current && newMsg.maNguoiGui === selectedUserRef.current.maDoiPhuong) {
                        setMessages(prev => [...prev, newMsg]);

                        // Gọi API báo đã đọc tin nhắn này ngay lập tức để không bị tích lũy thông báo chưa đọc
                        apiClient.post(`/api/v1/chat/read/${newMsg.maNguoiGui}/${currentUserId}`)
                            .then(() => {
                                setTimeout(() => fetchInboxListOnly(), 200);
                            })
                            .catch(err => console.error("Lỗi đọc tin nhắn thời gian thực:", err));
                    } else {
                        // Nếu thuộc người khác thì chỉ cần load lại danh sách inbox để tăng số nhảy tin nhắn chưa đọc
                        fetchInboxListOnly();
                    }
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
                setInboxList(prevList =>
                    prevList.map(item =>
                        item.maDoiPhuong === selectedUser.maDoiPhuong
                            ? { ...item, soTinChuaDoc: 0 }
                            : item
                    )
                );
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
            avatarDoiPhuong: patient.avatar // Đồng bộ ánh xạ dữ liệu ảnh từ Tab bệnh nhân
        });
    };

    //  XỬ LÝ GỬI TIN NHẮN CHUNG (Dùng chung cho cả Text và File)
    const sendChatMessage = (noiDung, loaiTinNhan = "TEXT") => {
        if (!stompClient.current?.connected || !selectedUser) return;

        const newMsg = {
            maNguoiGui: currentUserId,
            maNguoiNhan: selectedUser.maDoiPhuong,
            noiDung: noiDung,
            loaiTinNhan: loaiTinNhan
        };

        stompClient.current.publish({
            destination: '/app/chat',
            body: JSON.stringify(newMsg)
        });

        const renderedMsg = { ...newMsg, thoiGianGui: new Date().toISOString() };
        setMessages(prev => [...prev, renderedMsg]);
        setTimeout(() => fetchInboxListOnly(), 300);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedUser) return;

        sendChatMessage(messageInput, "TEXT");
        setMessageInput('');
        handleTypingStatus(false);
        isTypingSentRef.current = false;
    };

    //  XỬ LÝ UPLOAD VÀ GỬI FILE QUA API BACK-END ĐÃ BỔ SUNG
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedUser) return;

        // Tạo FormData để đóng gói file gửi lên HTTP Post
        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        try {
            // Gọi API upload của FileUploadController
            const res = await apiClient.post('/api/v1/files/upload-chat', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Lấy URL tương đối trả về từ backend (Ví dụ: /uploads/chats/filename.png)
            const fileUrl = res.data;

            // Kiểm tra định dạng file để định nghĩa loaiTinNhan phù hợp
            const isImage = file.type.startsWith('image/');
            const chatType = isImage ? "IMAGE" : "FILE";

            // Bắn tin nhắn URL qua WebSocket
            sendChatMessage(fileUrl, chatType);

        } catch (err) {
            console.error("Lỗi khi tải file lên hệ thống:", err);
            alert("Không thể gửi file. Vui lòng kiểm tra lại cấu hình dung lượng hoặc kết nối!");
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset input để có thể chọn lại file cũ nếu muốn
        }
    };

    // Hàm chuẩn hóa URL để tránh trùng lặp domain
    const formatFileUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url; // Nếu backend đã trả về full đường dẫn thì giữ nguyên
        }
        // Nếu backend chỉ trả về dạng "/uploads/chats/..."
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `http://localhost:8080${cleanUrl}`;
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

    // Định nghĩa base URL của backend để load được tài nguyên tĩnh từ thư mục /uploads
    const BASE_URL = "http://localhost:8080";

    return (
        <>
            {/* Input file ẩn phục vụ việc click vào icon kẹp giấy */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <div className={styles.modalOverlay} onClick={handleCloseChat}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

                    <div className={styles.modalHeader}>
                        <h2>Hộp thư tư vấn trực tuyến</h2>
                        <button className={styles.closeModalBtn} onClick={handleCloseChat}>✕</button>
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
                                                {/*  Hiển thị avatar đối phương thật từ DTO mới */}
                                                <img src={inbox.avatarDoiPhuong ? `${BASE_URL}${inbox.avatarDoiPhuong}` : "https://via.placeholder.com/48"} alt="avt" className={styles.avatar} />
                                                <div className={styles.inboxInfo}>
                                                    <div className={styles.inboxItemHeader}>
                                                        <h4>{inbox.tenDoiPhuong}</h4>
                                                        <span className={styles.time}>
                                                            {inbox.thoiGianCuoi ? new Date(inbox.thoiGianCuoi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </span>
                                                    </div>
                                                    <div className={styles.inboxSnippet}>
                                                        {/* Phân loại nội dung tin nhắn cuối ngoài danh sách inbox */}
                                                        <p>
                                                            {inbox.maNguoiGuiCuoi === currentUserId ? 'Bạn: ' : ''}
                                                            {inbox.loaiTinNhan === "IMAGE" ? ' [Hình ảnh]' : inbox.loaiTinNhan === "FILE" ? '📎 [Tệp tin]' : inbox.tinNhanCuoi}
                                                        </p>
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
                                                    <img src={patient.avatar ? `${BASE_URL}${patient.avatar}` : "https://via.placeholder.com/48"} alt="avt" className={styles.avatar} />
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
                                            <img src={selectedUser.avatarDoiPhuong ? `${BASE_URL}${selectedUser.avatarDoiPhuong}` : "https://via.placeholder.com/48"} alt="avt" className={styles.avatar} />
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
                                                        {!isMe && <img src={selectedUser.avatarDoiPhuong ? `${BASE_URL}${selectedUser.avatarDoiPhuong}` : "https://via.placeholder.com/32"} alt="avt" className={styles.messageAvatar} />}
                                                        <div className={styles.messageContent}>

                                                            {/*  RENDER TIN NHẮN THEO ĐỊNH DẠNG TEXT / IMAGE / FILE */}
                                                            <div className={styles.bubble}>
                                                                {msg.loaiTinNhan === "IMAGE" ? (
                                                                    <Zoom>
                                                                        <img
                                                                            src={formatFileUrl(msg.noiDung)}
                                                                            alt="Ảnh gửi trong cuộc trò chuyện"
                                                                            className={styles.chatImage}
                                                                            style={{
                                                                                maxWidth: '250px',
                                                                                maxHeight: '250px',
                                                                                borderRadius: '8px',
                                                                                cursor: 'pointer',
                                                                                objectFit: 'cover',
                                                                                display: 'block'
                                                                            }}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'>Lỗi tải ảnh</text></svg>";
                                                                            }}
                                                                        />
                                                                    </Zoom>
                                                                ) : msg.loaiTinNhan === "FILE" ? (
                                                                    <a
                                                                        href={formatFileUrl(msg.noiDung)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={styles.chatFileLink}
                                                                        style={{ color: isMe ? '#fff' : '#007bff', textDecoration: 'underline', wordBreak: 'break-all' }}
                                                                    >
                                                                        Tải xuống tài liệu đính kèm
                                                                    </a>
                                                                ) : (
                                                                    msg.noiDung
                                                                )}
                                                            </div>

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

                                        {/* Loading hiển thị trạng thái gửi tệp tin */}
                                        {isUploading && (
                                            <div className={`${styles.messageWrapper} ${styles.messageRight}`}>
                                                <div className={styles.messageContent}>
                                                    <div className={styles.bubble} style={{ opacity: 0.6 }}>Đang tải lên tệp tin...</div>
                                                </div>
                                            </div>
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
                                        {/* Kích hoạt chọn file từ thẻ input ẩn */}
                                        <button
                                            type="button"
                                            className={styles.attachBtn}
                                            onClick={() => fileInputRef.current.click()}
                                            disabled={isUploading}
                                        >
                                            📎
                                        </button>
                                        <input
                                            type="text"
                                            placeholder="Nhập tin nhắn..."
                                            value={messageInput}
                                            onChange={handleInputChange}
                                            disabled={isUploading}
                                        />
                                        <button type="submit" className={styles.sendBtn} disabled={isUploading}>Gửi</button>
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