import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import apiClient from "../../../../api/api"; 

const PatientChat = ({ maBacSiCanChat }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const stompClientRef = useRef(null);
  
  // 1. Lấy ID tài khoản của chính bệnh nhân đang đăng nhập
  const myAccountId = localStorage.getItem("idAccount"); 
  const targetAccountId = maBacSiCanChat; // ID tài khoản của Bác sĩ muốn chat cùng

  useEffect(() => {
    // 2. Tải lịch sử chat cũ qua REST API đã có của sếp
    const loadChatHistory = async () => {
      try {
        const response = await apiClient.get(`/api/v1/chat/history/${myAccountId}/${targetAccountId}?page=0&size=20`);
        // Do backend trả về Page Descending khi phân trang, sếp đảo ngược lại chuỗi để hiển thị từ cũ đến mới
        setMessages(response.data.content.reverse() || []);
        
        // Gọi API báo đã xem tin nhắn khi vừa vào phòng
        await apiClient.post(`/api/v1/chat/read/${myAccountId}/${targetAccountId}`);
      } catch (err) {
        console.error("Không thể tải lịch sử chat", err);
      }
    };
    loadChatHistory();

    // 3. Khởi tạo kết nối Realtime qua WebSocket
    const socket = new SockJS("http://localhost:8080/ws"); // Thay thế endpoint ws của sếp nếu khác
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Bệnh nhân đã kết nối Realtime thành công!");

        // Lắng nghe tin nhắn mới từ Bác sĩ trả về qua kênh cá nhân
        client.subscribe(`/user/${myAccountId}/queue/messages`, (message) => {
          const newMsg = JSON.parse(message.body);
          // Nếu tin nhắn thuộc về phòng chat hiện tại thì đẩy vào màn hình
          setMessages((prev) => [...prev, newMsg]);

          // Gửi tín hiệu đã xem ngược lại cho bác sĩ
          client.publish({
            destination: "/app/chat/read",
            body: JSON.stringify({ maNguoiGui: myAccountId, maNguoiNhan: targetAccountId })
          });
        });
      },
      onStompError: (frame) => {
        console.error("Lỗi kết nối STOMP: " + frame.headers["message"]);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) stompClientRef.current.deactivate();
    };
  }, [myAccountId, targetAccountId]);

  // 4. Hàm gửi tin nhắn lên Backend
  const handleSendMessage = () => {
    if (!text.trim() || !stompClientRef.current) return;

    const chatMessageDTO = {
      maNguoiGui: myAccountId,
      maNguoiNhan: targetAccountId,
      noiDung: text,
      loaiTinNhan: "TEXT",
    };

    // Bắn tin nhắn lên `@MessageMapping("/chat")` ở Backend
    stompClientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify(chatMessageDTO),
    });

    // Tự động thêm tin nhắn vừa gửi vào giao diện của mình
    setMessages((prev) => [...prev, { ...chatMessageDTO, thoiGianGui: new Date().toISOString() }]);
    setText("");
  };

  return (
    <div className="chat-box">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={msg.maNguoiGui === myAccountId ? "message-sent" : "message-received"}>
            <p>{msg.noiDung}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Nhập tin nhắn..." 
        />
        <button onClick={handleSendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default PatientChat;