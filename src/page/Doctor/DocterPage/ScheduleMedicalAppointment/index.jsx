import React, { useState, useEffect } from 'react';
import apiClient from '../../../../api/api';
import styles from './DoctorSchedulePage.module.css';

const DoctorSchedulePage = () => {
    const maBacSi = localStorage.getItem('idDoctor');
    const homNayStr = new Date().toISOString().split('T')[0];

    // QUẢN LÝ TRẠNG THÁI TUẦN
    const [currentMonday, setCurrentMonday] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    });

    const [weeklySchedules, setWeeklySchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    // QUẢN LÝ CHẾ ĐỘ CHỈNH SỬA
    const [isEditMode, setIsEditMode] = useState(false);

    // QUẢN LÝ TRẠNG THÁI MODAL TẠO LỊCH
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loaiHinhKham, setLoaiHinhKham] = useState('Offline');
    const [trangThaiBanDau, setTrangThaiBanDau] = useState('HoatDong');

    // DỮ LIỆU KHUNG GIỜ CỐ ĐỊNH TỪ CSDL
    const masterTimeSlots = [
        { id: 'KG01', time: '07:30 - 08:00', session: 'SANG' },
        { id: 'KG02', time: '08:00 - 08:30', session: 'SANG' },
        { id: 'KG03', time: '08:30 - 09:00', session: 'SANG' },
        { id: 'KG04', time: '09:00 - 09:30', session: 'SANG' },
        { id: 'KG05', time: '09:30 - 10:00', session: 'SANG' },
        { id: 'KG06', time: '10:00 - 10:30', session: 'SANG' },
        { id: 'KG07', time: '10:30 - 11:00', session: 'SANG' },
        { id: 'KG08', time: '13:00 - 13:30', session: 'CHIEU' },
        { id: 'KG09', time: '13:30 - 14:00', session: 'CHIEU' },
        { id: 'KG10', time: '14:30 - 15:00', session: 'CHIEU' },
        { id: 'KG11', time: '15:00 - 15:30', session: 'CHIEU' },
        { id: 'KG12', time: '15:30 - 16:00', session: 'CHIEU' },
        { id: 'KG13', time: '16:00 - 16:30', session: 'CHIEU' },
        { id: 'KG14', time: '16:30 - 17:00', session: 'CHIEU' },
    ];

    const getWeekRange = () => {
        const saturday = new Date(currentMonday);
        saturday.setDate(saturday.getDate() + 5);
        const sundayInclusive = new Date(currentMonday);
        sundayInclusive.setDate(sundayInclusive.getDate() + 6);
        const formatDate = (date) => date.toISOString().split('T')[0];
        return {
            startDateStr: formatDate(currentMonday),
            endDateStr: formatDate(sundayInclusive),
            displayStr: `Tuần (${currentMonday.getDate()}/${currentMonday.getMonth() + 1} - ${saturday.getDate()}/${saturday.getMonth() + 1}/${saturday.getFullYear()})`
        };
    };
    const { startDateStr, endDateStr, displayStr } = getWeekRange();

    const fetchSchedules = async () => {
        if (!maBacSi) return;
        setLoading(true);
        try {
            const res = await apiClient.get(`/api/v1/doctor-schedules/list`, {
                params: { maBacSi, startDate: startDateStr, endDate: endDateStr }
            });
            setWeeklySchedules(res.data || []);
        } catch (err) {
            console.error("Lỗi tải lịch khám:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [currentMonday, maBacSi]);

    const handlePrevWeek = () => {
        const d = new Date(currentMonday); d.setDate(d.getDate() - 7); setCurrentMonday(d);
        setIsEditMode(false);
    };
    const handleNextWeek = () => {
        const d = new Date(currentMonday); d.setDate(d.getDate() + 7); setCurrentMonday(d);
        setIsEditMode(false);
    };

    const generateDaysArray = () => {
        const labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        return labels.map((label, index) => {
            const d = new Date(currentMonday);
            d.setDate(currentMonday.getDate() + index);
            const dateStr = d.toISOString().split('T')[0];
            return { label, dateStr, isPast: dateStr < homNayStr, displayDate: `${d.getDate()}/${d.getMonth() + 1}` };
        });
    };
    const daysOfWeek = generateDaysArray();

    const getSlotsBySession = (dayLabel, session) => {
        const dayGroup = weeklySchedules.find(group => group.thuTrongTuan === dayLabel);
        if (!dayGroup || !dayGroup.danhSachLich) return [];
        return dayGroup.danhSachLich.filter(slot => {
            if (!slot.khungGio) return false;
            const startHour = parseInt(slot.khungGio.split(':')[0], 10);
            return session === 'SANG' ? startHour < 12 : startHour >= 12;
        });
    };

    const handleUpdateStatus = async (maLichLam, trangThaiMoi) => {
        try {
            const body = [{ maLichLam, trangThai: trangThaiMoi }];
            await apiClient.put(`/api/v1/doctor-schedules/update`, body);
            fetchSchedules();
        } catch (err) {
            alert("Lỗi cập nhật: " + (err.response?.data || err.message));
        }
    };

    const handleCreateSchedulesSubmit = async (e) => {
        e.preventDefault();
        if (!maBacSi) return alert("Vui lòng đăng nhập lại!");
        if (selectedDays.length === 0 || selectedSlots.length === 0) return alert("Vui lòng chọn ngày và giờ!");

        const payload = {
            maBacSi: maBacSi,
            danhSachNgayLamViec: selectedDays.map(date => ({
                ngayLamViec: date,
                khungGio: selectedSlots,
                loaiHinhKham: loaiHinhKham,
                trangThai: trangThaiBanDau
            }))
        };

        try {
            await apiClient.post(`/api/v1/doctor-schedules/create-weekly`, payload);
            alert("Lập lịch khám thành công!");
            setIsModalOpen(false);
            setSelectedDays([]);
            setSelectedSlots([]);
            fetchSchedules();
        } catch (err) {
            alert("Thất bại: " + (err.response?.data || err.message));
        }
    };

    const renderStatusElement = (slot) => {
        if (slot.trangThai === 'DaDat') {
            return (
                <div className={styles.statusLockedBadge} style={{ color: '#475569', fontWeight: 'bold', fontSize: '13px', marginTop: '5px' }}>
                    <i className="fa-solid fa-lock"></i> Đã đặt
                </div>
            );
        }
        if (!isEditMode) {
            return (
                <div className={styles.statusBadge} style={{ fontSize: '13px', marginTop: '5px', color: slot.trangThai === 'HoatDong' ? '#166534' : '#991b1b' }}>
                    {slot.trangThai === 'HoatDong' ? <><i className="fa-solid fa-circle-check"></i> Hoạt động</> : <><i className="fa-solid fa-circle-minus"></i> Không hoạt động</>}
                </div>
            );
        }
        return (
            <select
                value={slot.trangThai}
                onChange={(e) => handleUpdateStatus(slot.maLichLam, e.target.value)}
                className={styles.statusSelect}
                style={{ marginTop: '5px', width: '100%' }}
            >
                <option value="HoatDong">Hoạt động</option>
                <option value="KhongHoatDong">Không hoạt động</option>
            </select>
        );
    };

    if (!maBacSi) return (<div style={{ textAlign: 'center', padding: '50px' }}><h2>Vui lòng đăng nhập</h2></div>);

    // Tách riêng ca sáng/chiều cho Modal
    const morningSlots = masterTimeSlots.filter(s => s.session === 'SANG');
    const afternoonSlots = masterTimeSlots.filter(s => s.session === 'CHIEU');

    return (
        <div className={styles.scheduleContainer}>
            {/* Header Lịch */}
            <div className={styles.topHeader}>
                <div className={styles.weekSelector}>
                    <h2><i className="fa-solid fa-calendar-days"></i> Quản lý Lịch Bác sĩ</h2>
                    <div className={styles.navControls}>
                        <span className={styles.weekText}>{displayStr}</span>
                        <button onClick={handlePrevWeek} className={styles.arrowBtn}><i className="fa-solid fa-chevron-left"></i> Tuần trước</button>
                        <button onClick={handleNextWeek} className={styles.arrowBtn}>Tuần sau <i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={isEditMode ? styles.saveBtn : styles.editBtn}
                        style={{ backgroundColor: isEditMode ? '#ef4444' : '#3b82f6', color: 'white', padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                    >
                        {isEditMode ? <><i className="fa-solid fa-lock"></i> Đóng chỉnh sửa</> : <><i className="fa-solid fa-unlock"></i> Mở chỉnh sửa</>}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className={styles.addScheduleBtn} style={{ padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                        <i className="fa-solid fa-pen-to-square"></i> Tạo lịch khám
                    </button>
                </div>
            </div>

            {/* Bảng Lịch */}
            {loading ? (
                <div className={styles.loading}><i className="fa-solid fa-spinner fa-spin"></i> Đang tải lịch...</div>
            ) : (
                <div className={styles.gridTable}>
                    <div className={styles.gridHeaderRow}>
                        <div className={styles.sessionColumnHeader}>Ca Làm Việc</div>
                        {daysOfWeek.map((day, idx) => {
                            const isWeekend = day.label === 'Thứ 7';
                            return (
                                <div key={idx} className={`${styles.dayColumnHeader} ${day.isPast ? styles.pastHeader : ''} ${isWeekend ? styles.weekendHeader : ''}`}>
                                    <span className={styles.dayLabel}>{day.label}</span>
                                    <span className={styles.dayDate}>{day.displayDate}</span>
                                </div>
                            );
                        })}
                    </div>

                    {['SANG', 'CHIEU'].map(session => (
                        <div key={session} className={styles.gridBodyRow}>
                            <div className={styles.sessionCell}>
                                {session === 'SANG' ? <><i className="fa-solid fa-sun" style={{ color: '#eab308', marginRight: '5px' }}></i> Sáng</> : <><i className="fa-solid fa-moon" style={{ color: '#6366f1', marginRight: '5px' }}></i> Chiều</>}
                            </div>
                            {daysOfWeek.map((day, idx) => {
                                const slots = getSlotsBySession(day.label, session);
                                const isWeekend = day.label === 'Thứ 7';
                                return (
                                    <div key={idx} className={`${styles.slotsCell} ${slots.length === 0 ? styles.emptyCell : ''} ${isWeekend ? styles.weekendCell : ''}`}>
                                        {slots.map(slot => (
                                            <div key={slot.maLichLam} className={`${styles.slotCard} ${slot.trangThai === 'HoatDong' ? styles.HOAT_DONG : slot.trangThai === 'DaDat' ? styles.DA_DAT : styles.KHONG_HOAT_DONG}`}>
                                                <div className={styles.slotTime}><i className="fa-solid fa-clock"></i> {slot.khungGio}</div>
                                                <div className={styles.loaiHinh}><i className="fa-solid fa-user-doctor"></i> {slot.loaiHinhKham === 'Offline' ? 'Tại phòng khám' : 'Online'}</div>
                                                {renderStatusElement(slot)}
                                            </div>
                                        ))}
                                        {slots.length === 0 && <span className={styles.notSetText}>Trống</span>}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL TẠO LỊCH ĐƯỢC LÀM MỚI UI */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3><i className="fa-solid fa-calendar-plus"></i> Lập lịch làm việc tuần</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className={styles.closeModalX}>&times;</button>
                        </div>
                        <form onSubmit={handleCreateSchedulesSubmit}>

                            <div className={styles.formGroup}>
                                <label className={styles.sectionLabel}><i className="fa-solid fa-calendar-day"></i> 1. Chọn ngày làm việc</label>
                                <div className={styles.chipGroup}>
                                    {daysOfWeek.map((day) => {
                                        const disabled = day.isPast;
                                        return (
                                            <label key={day.dateStr} className={`${styles.chipItem} ${disabled ? styles.chipDisabled : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    disabled={disabled}
                                                    value={day.dateStr}
                                                    checked={selectedDays.includes(day.dateStr)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedDays([...selectedDays, day.dateStr]);
                                                        else setSelectedDays(selectedDays.filter(d => d !== day.dateStr));
                                                    }}
                                                    className={styles.hiddenCheckbox}
                                                />
                                                <div className={styles.dayChipContent}>
                                                    <span className={styles.chipDayLabel}>{day.label}</span>
                                                    <span className={styles.chipDateLabel}>{day.displayDate}</span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.sectionLabel}><i className="fa-solid fa-clock"></i> 2. Chọn khung giờ áp dụng</label>

                                <div className={styles.sessionContainer}>
                                    {/* Box Ca Sáng */}
                                    <div className={styles.sessionBox}>
                                        <h4 className={styles.sessionTitle} style={{ color: '#d97706' }}>
                                            <i className="fa-solid fa-sun"></i> Ca Sáng
                                        </h4>
                                        <div className={styles.chipGrid}>
                                            {morningSlots.map((slot) => (
                                                <label key={slot.id} className={styles.timeChipItem}>
                                                    <input
                                                        type="checkbox"
                                                        value={slot.id}
                                                        checked={selectedSlots.includes(slot.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedSlots([...selectedSlots, slot.id]);
                                                            else setSelectedSlots(selectedSlots.filter(s => s !== slot.id));
                                                        }}
                                                        className={styles.hiddenCheckbox}
                                                    />
                                                    <div className={`${styles.timeChipContent} ${styles.morningChip}`}>
                                                        {slot.time}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Box Ca Chiều */}
                                    <div className={styles.sessionBox}>
                                        <h4 className={styles.sessionTitle} style={{ color: '#4f46e5' }}>
                                            <i className="fa-solid fa-moon"></i> Ca Chiều
                                        </h4>
                                        <div className={styles.chipGrid}>
                                            {afternoonSlots.map((slot) => (
                                                <label key={slot.id} className={styles.timeChipItem}>
                                                    <input
                                                        type="checkbox"
                                                        value={slot.id}
                                                        checked={selectedSlots.includes(slot.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedSlots([...selectedSlots, slot.id]);
                                                            else setSelectedSlots(selectedSlots.filter(s => s !== slot.id));
                                                        }}
                                                        className={styles.hiddenCheckbox}
                                                    />
                                                    <div className={`${styles.timeChipContent} ${styles.afternoonChip}`}>
                                                        {slot.time}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.rowFormGroup}>
                                <div className={styles.formGroupHalf}>
                                    <label className={styles.sectionLabel}>3. Loại hình khám:</label>
                                    <select value={loaiHinhKham} onChange={(e) => setLoaiHinhKham(e.target.value)} className={styles.modalSelect}>
                                        <option value="Offline">Khám trực tiếp (Offline)</option>
                                        <option value="Online">Tư vấn trực tuyến (Online)</option>
                                    </select>
                                </div>
                                <div className={styles.formGroupHalf}>
                                    <label className={styles.sectionLabel}>4. Trạng thái:</label>
                                    <select value={trangThaiBanDau} onChange={(e) => setTrangThaiBanDau(e.target.value)} className={styles.modalSelect}>
                                        <option value="HoatDong">Hoạt động (Mặc định)</option>
                                        <option value="KhongHoatDong">Không hoạt động</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                                    <i className="fa-solid fa-ban"></i> Hủy
                                </button>
                                <button type="submit" className={styles.saveBtn}>
                                    <i className="fa-solid fa-floppy-disk"></i> Lưu lịch làm việc
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorSchedulePage;