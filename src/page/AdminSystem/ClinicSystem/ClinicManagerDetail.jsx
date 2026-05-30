import React from "react";
import styles from "./ClinicManager.module.css"; 

const ClinicManagerDetail = ({ request, onClose, onDelete }) => {
  const clinicId = request.maPhongKham;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={{ maxWidth: '900px' }}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết Phòng Khám (Hệ thống)</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.modalContent}>
          
          {/* THÔNG TIN CƠ BẢN */}
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Mã Phòng khám:</span>
                <span className={styles.infoValue}>{clinicId}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Mã Tài khoản:</span>
                <span className={styles.infoValue} style={{color: '#8e44ad', fontWeight: 'bold'}}>
                  {request.maTaiKhoan || "Chưa cấp"}
                </span>
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
                <span className={styles.infoLabel}>Số lượng Bác sĩ:</span>
                <span className={styles.infoValue}>{request.soLuongBacSi || 0}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Trạng thái:</span>
                <span className={styles.infoValue} style={{color: '#e67e22'}}>{request.trangThai}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ngày thành lập:</span>
                <span className={styles.infoValue}>{formatDate(request.ngayThanhLap)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ngày đăng ký (Hệ thống):</span>
                <span className={styles.infoValue}>{formatDate(request.ngayDangKy)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{request.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Số điện thoại:</span>
                <span className={styles.infoValue}>{request.soDienThoai}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Giờ hoạt động:</span>
                <span className={styles.infoValue}>
                   {request.gioBatDauLamViec ? request.gioBatDauLamViec.substring(0, 5) : "--:--"} - 
                   {request.gioKetThucLamViec ? request.gioKetThucLamViec.substring(0, 5) : "--:--"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tỉnh/Thành phố:</span>
                <span className={styles.infoValue}>{request.tinhThanhPho}</span>
              </div>
              <div className={styles.infoItem} style={{gridColumn: '1 / -1'}}>
                <span className={styles.infoLabel}>Địa chỉ chi tiết:</span>
                <span className={styles.infoValue}>{request.diaChi}</span>
              </div>
              <div className={styles.infoItem} style={{gridColumn: '1 / -1'}}>
                <span className={styles.infoLabel}>Mô tả ngắn:</span>
                <span className={styles.infoValue}>{request.moTa || "Không có mô tả"}</span>
              </div>
            </div>
          </div>

          {/* HÌNH ẢNH & GIẤY PHÉP */}
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Hình ảnh & Giấy phép</h3>
            <div className={styles.infoGrid}>
              
              <div className={styles.infoItem} style={{gridColumn: '1 / -1', marginBottom: '10px'}}>
                <span className={styles.infoLabel}>Ảnh phòng khám:</span>
                <span className={styles.infoValue}>
                  {request.anhPhongKham ? (
                    <img 
                      src={request.anhPhongKham} 
                      alt="Ảnh phòng khám" 
                      style={{ maxWidth: '250px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '8px' }} 
                    />
                  ) : (
                    <span style={{color: '#95a5a6'}}>Chưa cập nhật ảnh</span>
                  )}
                </span>
              </div>

              {/* 💥 ĐÃ GỘP: Chỉ giữ lại 1 trường Giấy phép duy nhất */}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Giấy phép hoạt động:</span>
                <span className={styles.infoValue}>
                  {request.giayPhep ? (
                    <a href={request.giayPhep} target="_blank" rel="noopener noreferrer" style={{color: '#3498db', textDecoration: 'none'}}>
                      <i className="fa-solid fa-file-contract"></i> Xem giấy phép
                    </a>
                  ) : (
                    <span style={{color: '#95a5a6'}}>Chưa có file</span>
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
            </div>
          </div>

          {/* NGƯỜI ĐẠI DIỆN & GÓI ĐĂNG KÝ */}
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Người đại diện & Gói dịch vụ</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tên người đại diện:</span>
                <span className={styles.infoValue}>{request.nguoiDaiDien}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>SĐT Người đại diện:</span>
                <span className={styles.infoValue}>{request.soDienThoaiNguoiDaiDien}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Mã gói dịch vụ:</span>
                <span className={styles.infoValue} style={{fontWeight: 'bold', color: '#2980b9'}}>
                  {request.maGoi || "Chưa đăng ký gói"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ngày hết hạn gói:</span>
                <span className={styles.infoValue} style={{fontWeight: 'bold', color: '#c0392b'}}>
                  {formatDate(request.ngayHetHan)}
                </span>
              </div>
            </div>
          </div>
          
        </div>

        <div className={styles.modalFooter}>
          <button 
             className={styles.deleteModalButton}
             onClick={() => onDelete(clinicId)}
             style={{marginRight: 'auto'}}
          >
             <i className="fa-solid fa-trash" style={{marginRight: '5px'}}></i> Xóa phòng khám
          </button>

          <button className={styles.closeModalButton} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicManagerDetail;