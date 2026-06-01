import React from 'react';
import styles from './ConfirmModal.module.css';
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Thông báo",
  message = "Bạn có chắc chắn muốn xóa không?",
  type,
  confirmText = "Xác nhận",
  cancelText = "Hủy"
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={type == "success" ? styles.modalContent : styles.modalContentSuccess} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actionGroup}>
          <button className={styles.btnConfirm} onClick={onConfirm}>
            {confirmText}
          </button>
          <button className={styles.btnCancel} onClick={onClose}>
            {cancelText}  
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;