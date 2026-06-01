import React from "react";
import styles from "./ClinicBrowseDetail.module.css";

// 💥 FIX 1: Nhận thêm 2 hàm onApprove và onReject từ component cha truyền vào
const ClinicRequestDetails = ({ request, onClose, onApprove, onReject }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };
  
  const IMAGE_BASE_URL = "http://localhost:8080";
  const getMediaUrl = (media) => {
    if (!media) return null;
    if (typeof media === "string") {
      if (media.startsWith("http") || media.startsWith("data:image")) {
        return media;
      }
      return media.startsWith("/") 
      ? `${IMAGE_BASE_URL}${media}` 
      : `${IMAGE_BASE_URL}/${media}`;
    }
    return null;
  };

  // 💥 FIX 2: Đồng bộ hiển thị và màu sắc theo chuẩn Tiếng Việt
  const getStatusText = (status) => {
    if (!status) return "Chưa rõ";
    return status;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Chờ duyệt": return styles.statusPending;
      case "Đã duyệt": return styles.statusApproved;
      case "Đã từ chối": return styles.statusRejected;
      default: return "";
    }
  };

  // Hàm xử lý khi bấm Duyệt trong Modal
  const handleApproveClick = () => {
    onApprove(request.maPhongKham);
    onClose(); // Bấm xong thì tự động đóng Modal (nút sẽ biến mất)
  };

  // Hàm xử lý khi bấm Từ chối trong Modal
  const handleRejectClick = () => {
    onReject(request.maPhongKham);
    onClose(); // Bấm xong thì tự động đóng Modal
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
                {/* Đã xóa maChuyenKhoa vì Backend không có trường này */}
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
                
                {/* Chỉ hiển thị lý do từ chối nếu trạng thái là "Đã từ chối" */}
                {request.trangThai === 'Đã từ chối' && request.lyDoTuChoi && (
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

            {/* THÔNG TIN GIẤY PHÉP VÀ HÌNH ẢNH */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Thông tin giấy phép & Hình ảnh</h3>
              <div className={styles.infoGrid}>
                
                {/* 💥 BỔ SUNG: Ảnh phòng khám từ Backend */}
                <div className={styles.infoItem} style={{gridColumn: '1 / -1', marginBottom: '15px'}}>
                  <span className={styles.infoLabel}>Ảnh phòng khám:</span>
                  <span className={styles.infoValue}>
                    {request.anhPhongKham ? (
                      <img 
                        src={getMediaUrl(request.anhPhongKham)} // Thêm getMediaUrl ở đây
                        alt="Ảnh phòng khám" 
                        style={{ maxWidth: '250px', borderRadius: '8px', border: '1px solid #ddd' }} 
                      />
                    ) : (
                      <span style={{color: '#95a5a6'}}>Chưa cập nhật ảnh</span>
                    )}
                  </span>
                </div>

                {/* 💥 FIX: Chuyển trường Giấy phép thành dạng Link mở file */}
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Giấy phép hoạt động:</span>
                  <span className={styles.infoValue}>
                    {request.giayPhep ? (
                      <a
                        href={getMediaUrl(request.giayPhep)} // Thêm getMediaUrl ở đây
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#2980b9', textDecoration: 'none', fontWeight: 'bold' }} 
                      >
                        <i className="fa-solid fa-file-contract" style={{marginRight: '5px'}}></i>
                          Xem giấy phép
                      </a>
                    ) : (
                      <span style={{color: '#95a5a6'}}>Chưa có file giấy phép</span>
                    )}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày cấp:</span>
                  <span className={styles.infoValue}>{formatDate(request.ngayCap)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Nơi cấp:</span>
                  <span className={styles.infoValue}>{request.noiCap}</span>
                </div>
                {/* Đã xóa tepDinhKem vì Backend không có trường này */}
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
        
        {/* 💥 FIX 3: Thêm nút Duyệt và Từ chối vào Footer của Modal */}
        <div className={styles.modalFooter}>
          
          {/* Nút Action chỉ hiện khi trạng thái là "Chờ duyệt" */}
          {request.trangThai === "Chờ duyệt" && (
            <div style={{ display: 'flex', gap: '10px', marginRight: 'auto' }}>
              <button 
                className={styles.approveButton} 
                onClick={handleApproveClick}
                style={{ padding: '8px 16px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                <i className="fa-solid fa-check" style={{marginRight: '5px'}}></i> Duyệt hồ sơ
              </button>
              <button 
                className={styles.rejectButton} 
                onClick={handleRejectClick}
                style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                <i className="fa-solid fa-xmark" style={{marginRight: '5px'}}></i> Từ chối
              </button>
            </div>
          )}

          <button className={styles.closeModalButton} onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicRequestDetails;