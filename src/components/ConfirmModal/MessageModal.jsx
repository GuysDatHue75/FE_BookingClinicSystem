import React from "react";
import styles from "./ConfirmModal.module.css"
const MessageModal = ({
    isOpen,
    title,
    message,
    type = 'success'
}) => {
    if (!isOpen) return null;
    return (
        <div className={styles.overlay} >
            <div className={styles.modal} >
                <div className={`${styles.header} ${styles[type]}`} style={{display:"flex",alignItems:"center", justifyContent:'space-between', backgroundColor:"#fff",color:"#5cb85c"}}>
                    <h3>{title}</h3>
                    <i class="fa-solid fa-circle-check"></i>
                </div>
            </div>
        </div>
    );
};


export default MessageModal;