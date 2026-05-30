import React from 'react';
import styles from './ClinicScheduleManager.module.css';

const ScheduleHeader = ({ 
    isEditMode, 
    canEdit, 
    handleCreateNextAvailableWeek, 
    setIsEditMode, 
    handleCancel, 
    handleSave 
}) => {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>Quản lý lịch làm việc Phòng Khám</h1>
            
            <div className={styles.buttonGroup}>
                <button className={`${styles.btn} ${styles.btnDefault}`}>
                    Lọc theo tuần
                </button>

                {!isEditMode && (
                    <button 
                        onClick={handleCreateNextAvailableWeek}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                        + Tạo lịch tuần trống tiếp theo
                    </button>
                )}

                {/* ĐÃ FIX: Đổi tên nút thành "Cập nhật" để định hướng rõ ràng hành động Edit */}
                {!isEditMode && canEdit() && (
                    <button 
                        onClick={() => setIsEditMode(true)}
                        className={`${styles.btn} ${styles.btnEdit}`}
                    >
                        Cập nhật lịch tuần này
                    </button>
                )}

                {isEditMode && (
                    <>
                        <button onClick={handleCancel} className={`${styles.btn} ${styles.btnCancel}`}>
                            Hủy
                        </button>
                        <button onClick={handleSave} className={`${styles.btn} ${styles.btnSave}`}>
                            Lưu lịch trình
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ScheduleHeader;