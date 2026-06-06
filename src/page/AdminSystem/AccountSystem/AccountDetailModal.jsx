import React from "react";
import styles from "./AccountManager.module.css";

const AccountDetailModal = ({ data, onClose }) => {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const IMAGE_BASE_URL = "http://localhost:8080";
  const getAvatarUrl = (media) => {
    if (!media) return `https://ui-avatars.com/api/?name=${encodeURIComponent(data.hoVaTen)}&background=random&color=fff&size=150`; // Avatar mặc định
    if (media.startsWith("http") || media.startsWith("data:image")) return media;
    return media.startsWith("/") ? `${IMAGE_BASE_URL}${media}` : `${IMAGE_BASE_URL}/${media}`;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={{ maxWidth: '700px' }}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết tài khoản</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.modalContent}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '10px' }}>
            <img 
              src={getAvatarUrl(data.anhDaiDien)} 
              alt="Avatar" 
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f1f2f6' }}
            />
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{data.hoVaTen}</h3>
              <span style={{ 
                backgroundColor: data.trangThai ? '#2ecc71' : '#e74c3c', 
                color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' 
              }}>
                {data.trangThai ? "Đang hoạt động" : "Đã khóa"}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
            <div className={styles.formGroup}>
              <label>Mã tài khoản:</label>
              <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>{data.maTaiKhoan}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Vai trò:</label>
              <div style={{ fontWeight: 'bold' }}>{data.vaiTro}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Số điện thoại:</label>
              <div>{data.soDt}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Email:</label>
              <div>{data.email || "Chưa cập nhật"}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Ngày tạo:</label>
              <div>{formatDate(data.ngayTao)}</div>
            </div>
            <div className={styles.formGroup}>
              <label>Cập nhật lần cuối:</label>
              <div>{formatDate(data.ngayCapNhat)}</div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailModal;