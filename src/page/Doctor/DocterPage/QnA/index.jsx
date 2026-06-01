import React, { useState, useEffect } from "react";
import styles from "./QAPage.module.css";
import apiClient from "../../../../api/api"; // Lưu ý: Chỉnh lại đường dẫn này cho khớp với cấu trúc dự án của bạn

const DoctorQAPage = () => {
  const [qaList, setQaList] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 1. Gọi API lấy danh sách câu hỏi đang chờ (Trạng thái false)
  useEffect(() => {
    window.scrollTo({
      behavior: "instant",
      top: 0,
    });

    const fetchPendingQuestions = async () => {
      try {
        // GET /api/v1/doctor/advise/pending
        const response = await apiClient.get("/api/v1/doctor/advise/pending");
        setQaList(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách câu hỏi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingQuestions();
  }, []);

  // 2. Lưu trữ nội dung text bác sĩ đang gõ
  const handleAnswerChange = (maTuVan, value) => {
    setAnswers({ ...answers, [maTuVan]: value });
  };

  // 3. Xử lý Gửi câu trả lời
  const handleSubmit = async (maTuVan) => {
    console.log(maTuVan);
    
    if (!answers[maTuVan] || answers[maTuVan].trim() === "") {
      alert("Vui lòng nhập câu trả lời trước khi gửi!");
      return;
    }

    // Lấy mã bác sĩ từ localStorage (được lưu lúc đăng nhập)
    const maBacSi = localStorage.getItem("maBacSi") || "BS001"; // "BS001" làm giá trị dự phòng test

    try {
      // POST /api/v1/doctor/advise/reply/{maTuVan}?maBacSi=...
      await apiClient.post(
        `/api/v1/doctor/advise/reply/${maTuVan}?maBacSi=${maBacSi}`,
        { cauTraLoi: answers[maTuVan] } // Khớp với RequestBody Map<String, String> bên backend
      );

      alert("Đã gửi câu trả lời cho bệnh nhân thành công!");

      // Loại bỏ câu hỏi vừa trả lời khỏi danh sách UI
      setQaList(qaList.filter((qa) => qa.maTuVan !== maTuVan));

      // Xóa state nội dung text vừa nhập
      const newAnswers = { ...answers };
      delete newAnswers[maTuVan];
      setAnswers(newAnswers);
    } catch (error) {
      console.error("Lỗi khi gửi trả lời:", error);

      // Bắt lỗi Race Condition (400 Bad Request) từ backend khi bác sĩ khác đã trả lời
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      alert(errorMessage);

      // Nếu câu hỏi đã có người khác trả lời, thì cũng nên ẩn nó đi khỏi màn hình của bác sĩ này
      if (error.response?.status === 400) {
        setQaList(qaList.filter((qa) => qa.maTuVan !== maTuVan));
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh sách câu hỏi từ bệnh nhân</h1>

      {isLoading ? (
        <p className={styles.empty}>Đang tải danh sách câu hỏi...</p>
      ) : qaList.length === 0 ? (
        <p className={styles.noQuestion}>Tất cả câu hỏi đã được trả lời!</p>
      ) : (
        <div className={styles.qaList}>
          {qaList.map((qa) => (
            // Dùng maTuVan làm Key thay vì id
            <div key={qa.maTuVan} className={styles.qaCard}>
              <p className={styles.patient}>
                {/* Do Entity hiện tại chỉ lưu maBenhNhan, sau này nếu có API join bảng bạn có thể hiển thị Tên */}
                <strong>Bệnh nhân: {qa.maBenhNhan}</strong>
                {qa.thoiGianHoi && (
                  <span style={{ float: 'right', fontSize: '13px', color: '#6b7280' }}>
                    {new Date(qa.thoiGianHoi).toLocaleString('vi-VN')}
                  </span>
                )}
              </p>

              <p className={styles.question}>❓ {qa.cauHoi}</p>

              <div className={styles.actionQnA}>
                <textarea
                  className={styles.textarea}
                  placeholder="Nhập câu trả lời chuyên môn của bạn..."
                  rows="4"
                  value={answers[qa.maTuVan] || ""}
                  onChange={(e) => handleAnswerChange(qa.maTuVan, e.target.value)}
                />

                <button
                  className={styles.btn}
                  onClick={() => handleSubmit(qa.maTuVan)}
                >
                  Gửi trả lời
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorQAPage;