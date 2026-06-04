import React, { useState, useEffect, useRef } from 'react';
import './AIChatBox.css';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import apiClient from '../api/api';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

const AIChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const name = JSON.parse(localStorage.getItem("user")).taiKhoan.hoVaTen;
    
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Xin chào ${name}! Hôm nay sức khỏe bạn có ổn không?`,
            sender: 'ai'
        }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);
    const idPatient = localStorage.getItem('idPatient');
    const city = localStorage.getItem('city');
    const navigate = useNavigate();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userQuestion = input;
        const userMsg = { id: Date.now(), text: userQuestion, sender: 'user' };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await apiClient.post(`/api/v1/chat`, {
                sessionId: idPatient,
                message: userQuestion,
                currentCity: city
            });

            let { answer, kieuTraVe, entity, data } = response.data;

            if (kieuTraVe === "clinic_search") {
                if (!data || data.length === 0) {
                    if (entity === 'doctor') {
                        answer = "Hiện tại tôi không tìm thấy bác sĩ nào phù hợp với yêu cầu của bạn. Bạn có muốn thử tìm kiếm với từ khóa khác không?";
                    }
                    else {
                        answer = "Rất tiếc, hiện chưa có phòng khám nào phù hợp với tìm kiếm của bạn tại khu vực này.";
                    }
                    kieuTraVe = null;
                }
            }

            const aiMsg = {
                id: Date.now() + 1,
                text: answer,
                sender: 'ai',
                kieuTraVe: kieuTraVe,
                entity: entity,
                data: data
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Xin lỗi, đã có lỗi kết nối xảy ra. Vui lòng thử lại sau!",
                sender: 'ai'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="chat-button" onClick={() => setIsOpen(!isOpen)}>
                <i class="fa-brands fa-bots"></i>
            </div>

            {isOpen && (
                <div className="chat-window glass-panel">
                    <div className="chat-header">
                        <div className="bot-icon-bg">
                            <Bot size={20} color="#2563eb" />
                        </div>
                        <div style={{ margin: '0' }}>
                            <h4 style={{ margin: 0, fontSize: '15px' }}>Trợ lý riêng của bạn</h4>
                            <span style={{ fontSize: '12px', color: '#10b981' }}>● Online</span>
                        </div>
                    </div>

                    <div ref={scrollRef} className="chat-messages-container">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message-wrapper ${msg.sender === 'user' ? 'user-align' : 'ai-align'}`}>
                                <div className={`message-bubble ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}>
                                    {msg.sender === 'ai' ? (
                                        <div className="markdown-content">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}

                                    {msg.kieuTraVe === "clinic_search" && msg.data && msg.data.length > 0 && (
                                        <div className="result-grid">
                                            {msg.data.map((item, index) => (
                                                <div key={index} className="info-card">
                                                    <div className="card-image">
                                                        <img
                                                            src={msg.entity === 'doctor' ? item.avt : (item.anhPhongKham || 'https://via.placeholder.com/300x180?text=Clinic')}
                                                            alt="thumbnail"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }}
                                                        />
                                                        {item.soSao && <div className="card-badge">⭐ {item.soSao}</div>}
                                                    </div>
                                                    <div className="card-body">
                                                        {msg.entity === 'doctor' && (
                                                            <span className="hoc-ham">{item.hocHam} - {item.chucVu}</span>
                                                        )}
                                                        <h4 className="card-title">
                                                            {msg.entity === 'doctor' ? `BS. ${item.taiKhoan?.hoVaTen}` : item.tenPhongKham}
                                                        </h4>
                                                        <p className="card-address">
                                                            {msg.entity === 'doctor' ? item.phongKham?.diaChi : item.diaChi}
                                                        </p>
                                                        <p className="card-desc">
                                                            {msg.entity === 'doctor'
                                                                ? (item.mieuTa1 ? item.mieuTa1.substring(0, 90) + "..." : "Đang cập nhật mô tả...")
                                                                : (item.moTa ? item.moTa.substring(0, 90) + "..." : "Đang cập nhật mô tả...")
                                                            }
                                                        </p>
                                                        <button className="card-btn" onClick={() => {navigate(`${msg.entity === 'doctor' ? `/xem-chi-tiet-bac-si/${item.maBacSi}` : `/chi-tiet-phong-kham/${item.maPhongKham}`}`); setIsOpen(false)}}>Xem chi tiết</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="ai-align message-wrapper">
                                <div className="ai-msg message-bubble" style={{ padding: '12px 20px' }}>
                                    <Loader2 className="animate-spin" size={20} color="#2563eb" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isLoading ? "AI đang trả lời..." : "Tìm kiếm phòng khám, bác sĩ hay hỏi về sức khỏe..."}
                            disabled={isLoading}
                            className="chat-input-field"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="chat-send-btn"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatBox;