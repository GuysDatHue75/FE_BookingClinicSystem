import React from 'react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Thông báo",
    message = "Bạn có chắc chắn muốn xóa không?",
    confirmText = "Xác nhận",
    cancelText = "Hủy"
}) => {
    // Nếu isOpen = false thì không render gì cả
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            {/* Dừng sự kiện click để không bị đóng khi click vào bên trong khối modal */}
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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