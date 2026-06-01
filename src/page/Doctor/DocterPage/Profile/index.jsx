import React, { useState, useEffect, useContext } from "react";
// Import CSS Module dưới dạng biến styles
import styles from "./Profile.module.css";
import apiClient from "../../../../api/api";
import { State } from "../../../../state/context";

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { image } = useContext(State);

  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0 });
    const maBacSi = localStorage.getItem("maBacSi") || "BS001";

    const fetchDoctorProfile = async () => {
      try {
        const response = await apiClient.get(`/api/v1/doctor/profile/${maBacSi}`);
        setDoctor(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin hồ sơ bác sĩ:", error);
        alert("Không thể tải thông tin hồ sơ bác sĩ!");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Đang tải thông tin hồ sơ...</div>;
  if (!doctor) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: 'red' }}>Không tìm thấy thông tin bác sĩ!</div>;

  const avatarUrl = doctor.anhDaiDien
    ? (doctor.anhDaiDien.startsWith("http") || doctor.anhDaiDien.startsWith("blob")
      ? doctor.anhDaiDien
      : `http://localhost:8080/uploads/${doctor.anhDaiDien}`)
    : image;

  return (
    <div className={styles.profileContainer}>
      {/* ----------------- CỘT TRÁI ----------------- */}
      <div className={styles.profileLeftColumn}>
        <div className={styles.avatarSection}>
          <img src={avatarUrl} alt="Avatar Bác sĩ" className={styles.doctorAvatar} />
        </div>

        <div className={`${styles.infoSection} ${styles.contactInfo}`}>
          <h4>Thông Tin Liên Hệ</h4>
          <ul>
            <li><i className="fas fa-user-tie"></i><span>Giới tính: <strong>{doctor.gioiTinh ? "Nam" : "Nữ"}</strong></span></li>
            <li><i className="fas fa-calendar-alt"></i><span>Ngày sinh: <strong>{doctor.ngaySinh ? new Date(doctor.ngaySinh).toLocaleDateString('vi-VN') : "Chưa cập nhật"}</strong></span></li>
            <li><i className="fas fa-id-card"></i><span>CCCD: <strong>{doctor.cccd || "Chưa cập nhật"}</strong></span></li>
            <li><i className="fas fa-home"></i><span>Địa chỉ: <strong>{doctor.diaChi || "Chưa cập nhật"}</strong></span></li>
            <li><i className="fas fa-phone-alt"></i><span>{doctor.soDienThoai || "Chưa cập nhật"}</span></li>
            <li><i className="fas fa-envelope"></i><span style={{ wordBreak: "break-all" }}>{doctor.email || "Chưa cập nhật"}</span></li>
          </ul>
        </div>

        <div className={`${styles.infoSection} ${styles.careerObjective}`}>
          <h4>Mục Tiêu Nghề Nghiệp</h4>
          <p style={{ fontSize: "14px", lineHeight: "1.5", whiteSpace: "pre-line", margin: 0 }}>
            {doctor.mieuTa1 || "Chưa có thông tin miêu tả mục tiêu nghề nghiệp."}
          </p>
        </div>

        <div className={`${styles.infoSection} ${styles.ratingSection}`}>
          <h4>Đánh Giá Công Tác Khám</h4>
          <div className={styles.stars}>
            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
          </div>
        </div>
      </div>

      {/* ----------------- CỘT PHẢI ----------------- */}
      <div className={styles.profileRightColumn}>
        <div className={styles.rightBox}>

          <div className={styles.rightHeader}>
            <h2>{doctor.hoVaTen ? doctor.hoVaTen.toUpperCase() : "BÁC SĨ CHƯA CẬP NHẬT TÊN"}</h2>
            <p>Mã phòng khám: {doctor.maPhongKham || "N/A"} | Chuyên khoa: {doctor.tenChuyenKhoa || doctor.maChuyenKhoa || "N/A"}</p>
          </div>

          <div className={`${styles.rightSection} ${styles.education}`}>
            <h3><i className="fas fa-graduation-cap"></i> HỌC VẤN & THÔNG TIN CHUYÊN MÔN</h3>
            <ul>
              <li><span>Chức vụ:</span> {doctor.chucVu || "Chưa cập nhật"}</li>
              <li><span>Học hàm/vị:</span> {doctor.hocHam || "Chưa cập nhật"}</li>
              <li><span>Bằng cấp:</span> {doctor.bangCap || "Chưa cập nhật"}</li>
              <li><span>Kinh nghiệm:</span> {doctor.kinhNghiem || "Chưa cập nhật"}</li>
              <li><span>Số giấy phép:</span> {doctor.soGiayPhep || "N/A"} (Cấp ngày: {doctor.ngayCap ? new Date(doctor.ngayCap).toLocaleDateString('vi-VN') : "N/A"} tại {doctor.noiCap || "N/A"})</li>
            </ul>
          </div>

          <div className={`${styles.rightSection} ${styles.activities}`}>
            <h3><i className="fas fa-flag"></i> HOẠT ĐỘNG & QUÁ TRÌNH CÔNG TÁC</h3>
            <div className={styles.timelineContainer}>
              <div className={styles.timelineItem}>
                <span className={styles.timelineDate}>Lịch sử hoạt động</span>
                <div className={styles.timelineContent}>
                  <p style={{ margin: 0, whiteSpace: "pre-line", lineHeight: "1.6" }}>
                    {doctor.hoatDong || "Chưa có thông tin về các hoạt động y khoa đã tham gia."}
                  </p>
                </div>
              </div>

              {doctor.mieuTa2 && (
                <div className={styles.timelineItem}>
                  <span className={styles.timelineDate}>Thông tin bổ sung</span>
                  <div className={styles.timelineContent}>
                    <p style={{ margin: 0, whiteSpace: "pre-line", lineHeight: "1.6" }}>{doctor.mieuTa2}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;