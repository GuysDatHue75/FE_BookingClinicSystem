import React from "react";
import styles from "./NotificationManager.module.css";

const NotificationDetailModal = ({ data, onClose }) => {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleString("vi-VN");
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
  const anhThongBaoUrl = getMediaUrl(data.anhThongBao);
  const filesUrl = getMediaUrl(data.files);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={{ maxWidth: '800px' }}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết thông báo</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.modalContent}>
          {/* Thông tin cơ bản */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className={styles.formGroup}>
              <label>Mã thông báo:</label>
              <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>{data.maThongBao}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Thời gian gửi:</label>
              <div>{formatDate(data.thoiGianGui)}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Loại thông báo:</label>
              <div>{data.loaiThongBao}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Đối tượng nhận:</label>
              <div>{data.doiTuongNhan}</div>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #f1f2f6', margin: '10px 0' }} />

          {/* Thông tin người gửi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
            <div className={styles.formGroup}>
              <label>Người viết:</label>
              <div style={{ fontWeight: '500' }}>{data.hoVaTen || "Hệ thống"}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Mã tài khoản:</label>
              <div>{data.maTaiKhoan}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Số điện thoại:</label>
              <div>{data.soDt || "N/A"}</div>
            </div>
          </div>

          {/* Danh sách người nhận đích danh (nếu có) */}
          {data.danhSachNguoiNhan && data.danhSachNguoiNhan.length > 0 && (
            <div className={styles.formGroup}>
              <label>Gửi đích danh đến:</label>
              <div className={styles.tagInputContainer} style={{ minHeight: 'auto', backgroundColor: '#fdfdfd' }}>
                {data.danhSachNguoiNhan.map((tag, index) => (
                  <span key={index} className={styles.tag} style={{ cursor: 'default' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nội dung thông báo */}
          <div className={styles.formGroup}>
            <label>Tiêu đề:</label>
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#2c3e50' }}>{data.tieuDe}</div>
          </div>

          <div className={styles.formGroup}>
            <label>Nội dung chi tiết:</label>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f1f2f6', 
              borderRadius: '6px', 
              whiteSpace: 'pre-wrap',
              minHeight: '100px'
            }}>
              {data.noiDung}
            </div>
          </div>

          {/* Đính kèm (Ảnh / File) */}
          {(anhThongBaoUrl || filesUrl) && (
             <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                {anhThongBaoUrl && (
                  <div className={styles.formGroup}>
                    <label>Ảnh đính kèm:</label>
                    <img 
                      src={anhThongBaoUrl} 
                      alt="Ảnh đính kèm" 
                      style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid #ddd' }} 
                    />
                  </div>
                )}

                {/* ĐÃ FIX: Mở PDF sang tab mới để xem trước thay vì ép tải xuống */}
                {filesUrl && (
                  <div className={styles.formGroup}>
                    <label>Tài liệu đính kèm:</label>
                    <a 
                      href={filesUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        display: 'inline-block', padding: '10px 15px', 
                        backgroundColor: '#e74c3c', color: 'white', 
                        textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' 
                      }}
                    >
                      <i className="fa-solid fa-file-pdf" style={{ marginRight: '8px' }}></i> Xem / Tải PDF
                    </a>
                  </div>
                )}
             </div>
          )}

        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;