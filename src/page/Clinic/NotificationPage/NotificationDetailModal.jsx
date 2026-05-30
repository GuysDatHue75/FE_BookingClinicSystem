import React from "react";
import styles from "./NotificationEditer.module.css";

const NotificationDetailModal = ({ data, onClose, onDelete }) => {
  if (!data) return null;

  const IMAGE_BASE_URL = "http://localhost:8080";

  // Hàm xử lý URL file/ảnh để hiển thị đúng Localhost
  const getMediaUrl = (media) => {
    if (!media) return null;
    if (typeof media === "string") {
      // return media.startsWith("http") ? media : `${IMAGE_BASE_URL}${media}`;
      if (media.startsWith("http") || media.startsWith("data:image")) {
        return media;
      }
      return media.startsWith("/") 
      ? `${IMAGE_BASE_URL}${media}` 
      : `${IMAGE_BASE_URL}/${media}`;
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleString("vi-VN");
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

          <hr style={{ border: '0', borderTop: '1px solid #f1f2f6', margin: '15px 0' }} />

          <div className={styles.formGroup}>
            <label>Tiêu đề:</label>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#2c3e50' }}>{data.tieuDe}</div>
          </div>

          <div className={styles.formGroup}>
            <label>Nội dung chi tiết:</label>
            <div style={{ padding: '15px', backgroundColor: '#f1f2f6', borderRadius: '6px', whiteSpace: 'pre-wrap', minHeight: '100px'}}>
              {data.noiDung}
            </div>
          </div>

          {(anhThongBaoUrl || filesUrl) && (
             <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                {anhThongBaoUrl && (
                  <div className={styles.formGroup}>
                    <label>Ảnh đính kèm:</label>
                    <img src={anhThongBaoUrl} alt="Đính kèm" style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                )}

                {filesUrl && (
                  <div className={styles.formGroup}>
                    <label>Tài liệu đính kèm:</label>
                    <a href={filesUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#e74c3c', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                      <i className="fa-solid fa-file-pdf" style={{ marginRight: '8px' }}></i> Xem / Tải PDF
                    </a>
                  </div>
                )}
             </div>
          )}
        </div>

        <div className={styles.modalFooter} style={{ display: 'flex', justifyContent: 'end' }}>
          <button 
            onClick={() => onDelete(data.maThongBao)} 
            style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <i className="fa-solid fa-trash" style={{ marginRight: '8px' }}></i> Xóa thông báo
          </button>

          <button className={styles.btnCancel} onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;