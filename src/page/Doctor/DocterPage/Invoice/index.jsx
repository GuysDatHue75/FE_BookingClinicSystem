import React, { useState, useEffect } from 'react';
import apiClient from '../../../../api/api';
import styles from './Invoice.module.css';
import PrescriptionDetailModal from './PrescriptionDetailModal';

const PrescriptionListPage = () => {
    const [allPrescriptions, setAllPrescriptions] = useState([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date('2026-05-19')); // Đồng bộ ngày theo dữ liệu mẫu JSON của bạn

    // Quản lý Modal đa năng (View / Edit / Create)
    const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'view', data: null });

    // Lấy mã bác sĩ đang đăng nhập từ hệ thống
    const currentDoctorId = localStorage.getItem('idDoctor');

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/api/v1/prescription/get/all');
            const data = res.data || [];

            // PHÂN ROLE: Chỉ lọc các đơn thuốc có maBacSi trùng với bác sĩ đã đăng nhập
            const doctorData = data.filter(item => item.maBacSi === currentDoctorId);
            setAllPrescriptions(doctorData);
        } catch (error) {
            console.error("Lỗi kết nối API danh sách đơn thuốc:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, [currentDoctorId]);

    // Lọc cục bộ theo ngày tháng trên thanh điều hướng
    useEffect(() => {
        const targetDateStr = selectedDate.toISOString().split('T')[0];
        const dayFiltered = allPrescriptions.filter(item => item.ngayLap && item.ngayLap.startsWith(targetDateStr));
        setFilteredPrescriptions(dayFiltered);
    }, [selectedDate, allPrescriptions]);

    const handleOpenDetail = async (maDonThuoc) => {
        try {
            const res = await apiClient.get(`/api/v1/prescription/get/${maDonThuoc}`);
            if (res.data) {
                setModalConfig({ isOpen: true, mode: 'view', data: res.data });
            }
        } catch (error) {
            alert("Không thể tải chi tiết đơn thuốc: " + error.message);
        }
    };

    const handleOpenCreate = () => {
        setModalConfig({
            isOpen: true,
            mode: 'create',
            data: {
                maLichKham: "", maHoSo: "HS" + Date.now().toString().slice(-4),
                trieuChung: "", chuanDoan: "", ketLuan: "", ghiChu: "",
                danhSachThuoc: []
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageTitle}>Đơn thuốc của tôi (Mã số cán bộ: {currentDoctorId})</div>

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

                <div className={styles.rightControls}>
                    <button className={styles.btnCreatePrescription} onClick={handleOpenCreate}>
                        <i className="fa-solid fa-plus"></i> Tạo đơn thuốc
                    </button>
                </div>
            </div>

            {loading ? <div className={styles.loading}>Đang xác thực và tải dữ liệu...</div> : (
                <div className={styles.cardGrid}>
                    {filteredPrescriptions.map((item) => (
                        <div key={item.maSoDonThuoc} className={styles.prescriptionCard} onClick={() => handleOpenDetail(item.maSoDonThuoc)}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTime}>
                                    <i className="fa-regular fa-clock"></i> {item.ngayLap ? new Date(item.ngayLap).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '00:00'}
                                </div>
                                <div className={styles.patientName}>{item.tenBenhNhan}</div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.infoLine}><strong>Mã đơn: {item.maSoDonThuoc}</strong></div>
                                <div className={styles.infoLine}><span className={styles.phoneColor}><i className="fa-solid fa-phone"></i> {item.sdtBenhNhan}</span></div>
                                <div className={styles.diagnosisText}><strong>Chẩn đoán:</strong> {item.chuanDoan}</div>
                            </div>
                        </div>
                    ))}
                    {filteredPrescriptions.length === 0 && <div className={styles.emptyState}>Không tìm thấy đơn thuốc nào do bạn kê trong ngày này.</div>}
                </div>
            )}

            {modalConfig.isOpen && (
                <PrescriptionDetailModal
                    mode={modalConfig.mode}
                    initialData={modalConfig.data}
                    onClose={() => { setModalConfig({ isOpen: false, mode: 'view', data: null }); fetchPrescriptions(); }}
                />
            )}
        </div>
    );
};

export default PrescriptionListPage;