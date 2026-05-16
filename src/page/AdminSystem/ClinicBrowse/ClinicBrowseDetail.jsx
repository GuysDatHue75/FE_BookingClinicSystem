import React from "react";
import styles from "./ClinicBrowseDetail.module.css";

const ClinicRequestDetails = ({ request, onClose }) => {
  // Hàm format ngày giờ (Xử lý chuỗi LocalDateTime từ Java: "2026-05-20T10:30:00")
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Trạng thái từ DB thường lưu in hoa (PENDING, APPROVED, REJECTED)
  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING": return "Chờ duyệt";
      case "APPROVED": return "Đã duyệt";
      case "REJECTED": return "Đã từ chối";
      default: return status || "Chưa rõ";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING": return styles.statusPending;
      case "APPROVED": return styles.statusApproved;
      case "REJECTED": return styles.statusRejected;
      default: return "";
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${styles.modalClinic}`}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết yêu cầu đăng ký phòng khám</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.clinicInfo}>
            
            {/* THÔNG TIN CƠ BẢN */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Mã Phòng khám:</span>
                  <span className={styles.infoValue}>{request.maPhongKham}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tên phòng khám:</span>
                  <span className={styles.infoValue}>{request.tenPhongKham}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Loại hình:</span>
                  <span className={styles.infoValue}>{request.loaiHinhPhongKham}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Mã chuyên khoa:</span>
                  <span className={styles.infoValue}>{request.maChuyenKhoa || "N/A"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Số lượng bác sĩ:</span>
                  <span className={styles.infoValue}>{request.soLuongBacSi || 0}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày thành lập:</span>
                  <span className={styles.infoValue}>{formatDate(request.ngayThanhLap)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày đăng ký:</span>
                  <span className={styles.infoValue}>{formatDate(request.ngayDangKy)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Số điện thoại:</span>
                  <span className={styles.infoValue}>{request.soDienThoai}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{request.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Địa chỉ cụ thể:</span>
                  <span className={styles.infoValue}>{request.diaChi}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tỉnh/Thành phố:</span>
                  <span className={styles.infoValue}>{request.tinhThanhPho}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Giờ hoạt động:</span>
                  <span className={styles.infoValue}>
                    {/* Kết hợp giờ bắt đầu và kết thúc */}
                    {request.gioBatDauLamViec ? request.gioBatDauLamViec.substring(0, 5) : "--:--"} - 
                    {request.gioKetThucLamViec ? request.gioKetThucLamViec.substring(0, 5) : "--:--"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Trạng thái:</span>
                  <span className={`${styles.infoValue} ${getStatusClass(request.trangThai)}`}>
                    {getStatusText(request.trangThai)}
                  </span>
                </div>
                {/* Chỉ hiển thị lý do từ chối nếu trạng thái là REJECTED */}
                {request.trangThai?.toUpperCase() === 'REJECTED' && request.lyDoTuChoi && (
                  <div className={styles.infoItem} style={{gridColumn: '1 / -1'}}>
                    <span className={styles.infoLabel} style={{color: 'red'}}>Lý do từ chối:</span>
                    <span className={styles.infoValue} style={{color: 'red', fontWeight: '500'}}>{request.lyDoTuChoi}</span>
                  </div>
                )}
              </div>
              <div className={styles.infoItem} style={{marginTop: '15px'}}>
                <span className={styles.infoLabel}>Mô tả ngắn:</span>
                <span className={styles.infoValue}>{request.moTa || "Không có mô tả"}</span>
              </div>
            </div>

            {/* THÔNG TIN GIẤY PHÉP */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Thông tin giấy phép</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Số giấy phép:</span>
                  <span className={styles.infoValue}>{request.giayPhep}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày cấp:</span>
                  <span className={styles.infoValue}>{formatDate(request.ngayCap)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Nơi cấp:</span>
                  <span className={styles.infoValue}>{request.noiCap}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tệp đính kèm:</span>
                  <span className={styles.infoValue}>
                    {request.tepDinhKem ? (
                      <a
                        href={request.tepDinhKem}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.attachmentLink}
                      >
                        <i className="fa-solid fa-file-pdf" style={{marginRight: '5px'}}></i>
                        Xem tệp đính kèm
                      </a>
                    ) : (
                      <span style={{color: '#95a5a6'}}>Không có tệp đính kèm</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* THÔNG TIN NGƯỜI ĐẠI DIỆN & GÓI ĐĂNG KÝ */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Thông tin người đại diện</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tên người đại diện:</span>
                  <span className={styles.infoValue}>{request.nguoiDaiDien}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Số điện thoại:</span>
                  <span className={styles.infoValue}>{request.soDienThoaiNguoiDaiDien}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Mã gói đăng ký:</span>
                  <span className={styles.infoValue} style={{fontWeight: 'bold', color: '#2980b9'}}>
                    {request.maGoi || "Chưa đăng ký gói"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.closeModalButton} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicRequestDetails;