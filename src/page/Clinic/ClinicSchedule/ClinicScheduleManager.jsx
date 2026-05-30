import React, { useState, useEffect } from 'react';
import scheduleService from '../../../services/clinic/ScheduleService';
import doctorService from '../../../services/clinic/DoctorService';
import dayjs from 'dayjs'; 
import styles from './ClinicScheduleManager.module.css';
import ScheduleHeader from './ScheduleHeader';
import ScheduleGrid from './ScheduleGrid';

const ClinicScheduleManager = () => {
    const maPhongKham = localStorage.getItem('idPhongKham');

    const [schedule, setSchedule] = useState({}); 
    const [allDoctors, setAllDoctors] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1); // Page 1 = Tuần hiện tại
    const [isEditMode, setIsEditMode] = useState(false);
    const [weekInfo, setWeekInfo] = useState({ startDate: null, endDate: null });
    const [loading, setLoading] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await doctorService.getActiveBasicDoctors(maPhongKham);
                setAllDoctors(Array.isArray(data) ? data : (data?.data || [])); 
            } catch (error) {
                console.error("Lỗi lấy danh sách bác sĩ:", error);
            }
        };
        if (maPhongKham) fetchDoctors();
    }, [maPhongKham]);

    useEffect(() => {
        if (maPhongKham && !isCreatingNew) fetchSchedule(currentPage);
    }, [currentPage, maPhongKham, isCreatingNew]);

    const fetchSchedule = async (page) => {
        setLoading(true);
        try {
            const data = await scheduleService.getClinicWeeklySchedule(maPhongKham, page);
            
            if (data) {
                // 1. Mapping đúng tên trường ngày tháng từ Backend (ngayDauTuan, ngayCuoiTuan)
                setWeekInfo({ 
                    startDate: data.ngayDauTuan, 
                    endDate: data.ngayCuoiTuan 
                });

                // 2. Chuyển đổi mảng dailySchedules của Backend thành Object { dayIndex: { shiftId: [docId] } } cho Frontend
                const parsedSchedule = {};
                
                if (data.dailySchedules && Array.isArray(data.dailySchedules)) {
                    data.dailySchedules.forEach(daily => {
                        // Tính xem ngày này là thứ mấy trong tuần (0 = Thứ 2, ..., 6 = Chủ Nhật)
                        const dayIndex = dayjs(daily.ngay).diff(dayjs(data.ngayDauTuan), 'day');

                        if (dayIndex >= 0 && dayIndex <= 6) {
                            parsedSchedule[dayIndex] = {};
                            
                            // Lặp qua các ca (Sáng, Chiều, Tối) trong ngày đó
                            daily.shifts.forEach(shift => {
                                // Lấy danh sách mã bác sĩ map vào ca tương ứng (VD: CA01, CA02)
                                parsedSchedule[dayIndex][shift.maCaLamViec] = shift.doctors.map(doc => doc.maBacSi);
                            });
                        }
                    });
                }
                
                // Cập nhật state với data đã parse thành công
                setSchedule(parsedSchedule); 
            }
        } catch (error) {
            console.error("Lỗi khi tải lịch:", error);
        } finally {
            setLoading(false);
        }
    };

    // ĐÃ FIX: Logic check hạn cập nhật chính xác 100% giống Backend
    const canEdit = () => {
        if (!weekInfo.startDate) return false;
        // Hạn chót là 23:59 Chủ Nhật của tuần liền TRƯỚC ĐÓ
        const deadline = dayjs(weekInfo.startDate).subtract(1, 'day').endOf('day');
        return dayjs().isBefore(deadline);
    };

    const handleCreateNextAvailableWeek = async () => {
        try {
            const data = await scheduleService.getNextAvailableWeek(maPhongKham);
            if (data) {
                setWeekInfo({ startDate: data.startDate, endDate: data.endDate });
                setIsEditMode(true);
                setIsCreatingNew(true);
                setSchedule({}); 
            }
        } catch (error) {
            alert("Lỗi tạo tuần mới!");
        }
    };

    const toggleDoctorShift = (dayIndex, shiftId, doctorId) => {
        if (!isEditMode) return;
        setSchedule(prev => {
            const newState = { ...prev };
            if (!newState[dayIndex]) newState[dayIndex] = {};
            if (!newState[dayIndex][shiftId]) newState[dayIndex][shiftId] = [];

            const list = newState[dayIndex][shiftId];
            newState[dayIndex][shiftId] = list.includes(doctorId) 
                ? list.filter(id => id !== doctorId) 
                : [...list, doctorId];
            return newState;
        });
    };

    const handleSave = async () => {
        try {
            const shiftAssignments = [];
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const targetDate = dayjs(weekInfo.startDate).add(dayIndex, 'day').format('YYYY-MM-DD');
                ['CA01', 'CA02', 'CA03'].forEach(shiftId => {
                    shiftAssignments.push({
                        ngayLamViec: targetDate,
                        maCaLamViec: shiftId,
                        danhSachMaBacSi: schedule[dayIndex]?.[shiftId] || []
                    });
                });
            }

            await scheduleService.updateShifts(maPhongKham, {
                startDate: weekInfo.startDate,
                shiftAssignments
            });
            
            alert("Lưu lịch thành công!");
            setIsEditMode(false);
            setIsCreatingNew(false);
            fetchSchedule(currentPage);
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi lưu lịch!");
        }
    };

    if (!maPhongKham) return <div className="p-6 text-center text-red-500">Thiếu thông tin Phòng Khám</div>;

    return (
        <div className={styles.container}>
            <ScheduleHeader 
                isEditMode={isEditMode} 
                canEdit={canEdit} 
                handleCreateNextAvailableWeek={handleCreateNextAvailableWeek}
                setIsEditMode={setIsEditMode}
                handleCancel={() => {
                    setIsEditMode(false);
                    setIsCreatingNew(false);
                    fetchSchedule(currentPage); 
                }}
                handleSave={handleSave}
            />

            {isCreatingNew && (
                <div style={{marginBottom: '1rem', color: '#b91c1c', fontWeight: 'bold'}}>
                    Lưu ý: Bạn đang khởi tạo lịch trình cho tuần trống tiếp theo!
                </div>
            )}

            {loading ? <div className={styles.loading}>Đang tải...</div> : (
                <>
                    <ScheduleGrid 
                        weekInfo={weekInfo} 
                        schedule={schedule} 
                        allDoctors={allDoctors} 
                        isEditMode={isEditMode} 
                        toggleDoctorShift={toggleDoctorShift}
                    />

                    {!isCreatingNew && (
                        <div className={styles.pagination}>
                            {/* ĐÃ FIX: Đảo chiều nút bấm hợp logic thời gian (Quá khứ <- Hiện tại -> Tương lai) */}
                            <button 
                                disabled={isEditMode} 
                                onClick={() => setCurrentPage(p => p - 1)}
                                className={styles.btnPage}
                            >
                                &larr; Tuần cũ hơn
                            </button>
                            
                            <span className={styles.pageText}>
                                Trang {currentPage} {weekInfo.startDate ? `(${weekInfo.startDate} tới ${weekInfo.endDate})` : ''}
                            </span>
                            
                            <button 
                                disabled={isEditMode}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className={styles.btnPage}
                            >
                                Tuần mới hơn &rarr;
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ClinicScheduleManager;