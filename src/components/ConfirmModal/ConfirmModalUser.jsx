import styles from "./ConfirmModal.module.css"
const ConfirmModalUser = ({
  isOpen,
  title,
  message ,
  type,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={type == "success" ? styles.modalContentSuccess : styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actionGroup}>
          <button className={type == "success" ? styles.btnConfirmSuccess : styles.btnConfirm} onClick={onConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModalUser;