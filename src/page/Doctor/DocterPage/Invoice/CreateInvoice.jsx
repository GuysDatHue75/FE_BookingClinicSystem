import React, { useState, useEffect } from 'react';
import apiClient from '../../../../api/api';
import styles from './Invoice.module.css';
import PrescriptionDetailModal from './DetailInvoice/PrescriptionDetailModal';

const CreateInvoice = () => {
    const [appointments, setAppointments] = useState([]); // Lưu danh sách lịch khám gốc từ API
    const [filteredAppointments, setFilteredAppointments] = useState([]); // Danh sách lịch khám sau khi lọc theo ngày
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    // Cấu hình Modal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'create', data: null });

    // Lấy mã bác sĩ đang đăng nhập
    const currentDoctorId = localStorage.getItem('idDoctor');

    // 1. LẤY DANH SÁCH LỊCH KHÁM ĐÃ XÁC NHẬN TỪ BACKEND
    const fetchApprovedAppointments = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/api/v1/confirm-appointment/doctor-waiting', {
                params: {
                    maBacSi: currentDoctorId
                }
            });

            const data = res.data || [];

            // Sau đó mới console.log nó ra
            console.log("Dữ liệu API trả về:", data);

            setAppointments(data);
        } catch (error) {
            console.error("Lỗi kết nối API danh sách lịch khám đã duyệt:", error);
            setAppointments([]); // Tránh lỗi crash giao diện khi API lỗi
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentDoctorId) {
            fetchApprovedAppointments();
        }
    }, [currentDoctorId]);

    // 2. LỌC DỮ LIỆU THEO THANH CHUYỂN NGÀY (Sửa trường lọc thành ngayLamViec theo DTO)
    useEffect(() => {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');

        const dateISO = `${year}-${month}-${day}`;
        if (!Array.isArray(appointments)) {
            setFilteredAppointments([]);
            return;
        }

        const dayFiltered = appointments.filter(item => {
            const appointmentDate = item.ngayLamViec;
            return appointmentDate.startsWith(dateISO)
        });
        setFilteredAppointments(dayFiltered);
    }, [selectedDate, appointments]);

    // 3. XỬ LÝ SỰ KIỆN KHI BẤM NÚT "KHÁM & KÊ ĐƠN" (Đồng bộ Map dữ liệu sang Modal)
    const handleOpenCreatePrescription = (appointmentItem) => {
        const generateMaHoSo = () => {
            const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Sinh 8 số ngẫu nhiên
            return `HS${randomNumber}`; // Ghép với tiền tố 'HS' thành đúng 10 ký tự
        };
        setModalConfig({
            isOpen: true,
            mode: 'create',
            data: {
                maLichKham: appointmentItem.maLichKham,
                maHoSo: generateMaHoSo(),
                tenBenhNhan: "",
                sdtBenhNhan: "",
                trieuChung: "",
                chuanDoan: "",
                ketLuan: "",
                ghiChu: "",
                danhSachThuoc: []
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageTitle}>Phòng Khám Bác Sĩ - Chờ Khám & Kê Đơn</div>

            {/* THANH ĐIỀU HƯỚNG THỜI GIAN */}
            <div className={styles.toolbarSection}>
                <div className={styles.dateNavigator}>
                    <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }} className={styles.navBtn}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <span className={styles.dateLabel}>
                        Ngày {String(selectedDate.getDate()).padStart(2, '0')} / {String(selectedDate.getMonth() + 1).padStart(2, '0')} / {selectedDate.getFullYear()}
                    </span>
                    <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }} className={styles.navBtn}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            {/* BẢNG DỮ LIỆU ĐÃ DUYỆT */}
            {loading ? <div className={styles.loading}>Đang tải danh sách lịch khám đã xác nhận...</div> : (
                <div className={styles.sectionWrapper}>
                    <div className={styles.tableResponsive} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '14px' }}>
                                    <th style={{ padding: '10px' }}>Mã lịch</th>
                                    <th style={{ padding: '10px' }}>Bệnh nhân</th>
                                    <th style={{ padding: '10px' }}>Số điện thoại</th>
                                    <th style={{ padding: '10px' }}>Lý do khám</th>
                                    <th style={{ padding: '10px' }}>Khung giờ</th>
                                    <th style={{ padding: '10px' }}>Trạng thái</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((app) => (
                                        <tr key={app.maLichKham} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                                            <td style={{ padding: '12px 10px' }}><strong>{app.maLichKham}</strong></td>
                                            {/* Sửa hiển thị theo DTO */}
                                            <td>{app.hoVaTen}</td>
                                            <td>
                                                <span style={{ color: '#0284c7' }}>
                                                    <i className="fa-solid fa-phone" style={{ fontSize: '12px', marginRight: '4px' }}></i>
                                                    {app.soDt}
                                                </span>
                                            </td>
                                            <td>{app.lyDoKham || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>Không có</span>}</td>
                                            <td>{app.maKhungGio}</td>
                                            <td>
                                                <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                                    {app.trangThai}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                    onClick={() => handleOpenCreatePrescription(app)}
                                                >
                                                    <i className="fa-solid fa-file-medical"></i> Khám & Kê đơn
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                            Không có ca hẹn đã duyệt nào cần xử lý trong ngày này.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL CHI TIẾT SẴN CÓ CỦA BẠN */}
            {modalConfig.isOpen && (
                <PrescriptionDetailModal
                    mode={modalConfig.mode}
                    initialData={modalConfig.data}
                    onClose={() => {
                        setModalConfig({ isOpen: false, mode: 'create', data: null });
                        fetchApprovedAppointments();
                    }}
                />
            )}
        </div>
    );
};

export default CreateInvoice;