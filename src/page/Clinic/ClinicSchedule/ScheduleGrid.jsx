import React from 'react';
import dayjs from 'dayjs';
import styles from './ClinicScheduleManager.module.css';

const DAYS_OF_WEEK = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
const SHIFTS = [
    { id: 'CA01', name: 'Sáng' },
    { id: 'CA02', name: 'Chiều' },
    { id: 'CA03', name: 'Tối' }
];

const ScheduleGrid = ({ weekInfo, schedule, allDoctors, isEditMode, toggleDoctorShift }) => {
    return (
        <div className={styles.grid}>
            {DAYS_OF_WEEK.map((dayName, dayIndex) => {
                const dateOfColumn = weekInfo.startDate 
                    ? dayjs(weekInfo.startDate).add(dayIndex, 'day').format('DD/MM') 
                    : '';

                return (
                    <div key={dayIndex} className={styles.dayColumn}>
                        <div className={styles.dayHeader}>
                            {dayName} <br/> 
                            <span style={{fontSize: '0.85rem', fontWeight: 'normal', color: '#0d9488'}}>
                                {dateOfColumn && `(${dateOfColumn})`}
                            </span>
                        </div>
                        
                        <div className={styles.dayBody}>
                            {SHIFTS.map(shift => {
                                // Lấy danh sách ID bác sĩ đã được phân công vào ca này
                                const scheduledDoctorIds = schedule[dayIndex]?.[shift.id] || [];

                                return (
                                    <div key={shift.id} className={styles.shiftBlock}>
                                        <h3 className={styles.shiftTitle}>Ca {shift.name}</h3>
                                        <div className={styles.doctorList}>
                                            
                                            {/* CHẾ ĐỘ XEM (VIEW MODE): Chỉ hiện bác sĩ có lịch */}
                                            {!isEditMode ? (
                                                scheduledDoctorIds.length > 0 ? (
                                                    scheduledDoctorIds.map(docId => {
                                                        // Tìm tên bác sĩ từ mảng allDoctors để hiển thị
                                                        const doctor = allDoctors.find(d => (d.maBacSi || d.id) === docId);
                                                        const docName = doctor ? (doctor.tenBacSi || doctor.name) : "Bác sĩ...";
                                                        return (
                                                            <div key={docId} className={styles.scheduledDoctor}>
                                                                {docName}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <span className={styles.emptyData}>Trống</span>
                                                )
                                            ) : (
                                                /* CHẾ ĐỘ CHỈNH SỬA (EDIT MODE): Hiện tất cả kèm checkbox */
                                                allDoctors.length > 0 ? allDoctors.map(doctor => {
                                                    const docId = doctor.maBacSi || doctor.id;
                                                    const docName = doctor.tenBacSi || doctor.name || "Bác sĩ chưa có tên";
                                                    const isChecked = scheduledDoctorIds.includes(docId);
                                                    
                                                    return (
                                                        <label key={docId} className={styles.doctorLabel}>
                                                            <input 
                                                                type="checkbox"
                                                                checked={!!isChecked}
                                                                onChange={() => toggleDoctorShift(dayIndex, shift.id, docId)}
                                                                className={styles.doctorCheckbox}
                                                            />
                                                            <span className={isChecked ? styles.doctorNameChecked : styles.doctorName}>
                                                                {docName}
                                                            </span>
                                                        </label>
                                                    );
                                                }) : (
                                                    <span className={styles.emptyData}>Không có dữ liệu</span>
                                                )
                                            )}

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ScheduleGrid;