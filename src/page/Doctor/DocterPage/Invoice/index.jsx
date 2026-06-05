import React, { useState, useEffect } from 'react';
import apiClient from '../../../../api/api';
import styles from './Invoice.module.css';
import PrescriptionDetailModal from './DetailInvoice/PrescriptionDetailModal';

const PrescriptionListPage = () => {
    const [allPrescriptions, setAllPrescriptions] = useState([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Quản lý Modal đa năng (hiện tại chỉ còn View / Edit)
    const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'view', data: null });

    // Lấy mã bác sĩ đang đăng nhập từ hệ thống
    const currentDoctorId = localStorage.getItem('idDoctor');

    // 1. LẤY DANH SÁCH ĐƠN THUỐC
    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/api/v1/prescription/get/all');
            const data = res.data || [];

            // Lọc các đơn thuốc có maBacSi trùng với bác sĩ đã đăng nhập
            // Lưu ý: Đảm bảo Backend trả về trường maBacSi trong PrescriptionDTO
            const doctorData = data.filter(item => item.maBacSi === currentDoctorId || !item.maBacSi);

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


    // 2. XEM CHI TIẾT ĐƠN THUỐC
    const handleOpenDetail = async (maDonThuoc) => {
        try {
            const res = await apiClient.get(`/api/v1/prescription/get/${maDonThuoc}`);
            if (res.data) {
                // Mở modal ở chế độ 'view'. Trong modal sẽ có nút để chuyển sang 'edit'
                setModalConfig({ isOpen: true, mode: 'view', data: res.data });

            }
        } catch (error) {
            alert("Không thể tải chi tiết đơn thuốc: " + (error.response?.data || error.message));
        }
    };


    // 3. XÓA ĐƠN THUỐC
    const handleDelete = async (e, maDonThuoc) => {
        e.stopPropagation(); // Rất quan trọng: Ngăn không cho click truyền xuống thẻ cha (mở Modal)

        if (window.confirm(`Bạn có chắc chắn muốn xóa đơn thuốc [${maDonThuoc}] này không?`)) {
            try {
                const res = await apiClient.delete(`/api/v1/prescription/delete/${maDonThuoc}`);
                alert(res.data || "Xóa đơn thuốc thành công!");

                // Load lại danh sách sau khi xóa thành công
                fetchPrescriptions();
            } catch (error) {
                alert("Lỗi khi xóa đơn thuốc: " + (error.response?.data || error.message));
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageTitle}>Đơn thuốc của tôi (Mã bác sĩ: {currentDoctorId})</div>

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

            {loading ? <div className={styles.loading}>Đang xác thực và tải dữ liệu...</div> : (
                <div className={styles.cardGrid}>
                    {filteredPrescriptions.map((item) => (
                        <div key={item.maSoDonThuoc} className={styles.prescriptionCard} onClick={() => handleOpenDetail(item.maSoDonThuoc)}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTime}>
                                    <i className="fa-regular fa-clock"></i> {item.ngayLap ? new Date(item.ngayLap).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '00:00'}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div className={styles.patientName}>{item.tenBenhNhan || 'Chưa rõ tên'}</div>

                                    {/* NÚT XÓA ĐƠN THUỐC */}
                                    <button
                                        onClick={(e) => handleDelete(e, item.maSoDonThuoc)}
                                        style={{ backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
                                        title="Xóa đơn thuốc này"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.infoLine}><strong>Mã đơn: {item.maSoDonThuoc}</strong></div>
                                <div className={styles.infoLine}><span className={styles.phoneColor}><i className="fa-solid fa-phone"></i> {item.sdtBenhNhan || 'Trống'}</span></div>
                                <div className={styles.diagnosisText}><strong>Chẩn đoán:</strong> {item.chuanDoan || 'Không có chẩn đoán'}</div>
                            </div>
                        </div>
                    ))}
                    {filteredPrescriptions.length === 0 && <div className={styles.emptyState}>Không tìm thấy đơn thuốc nào do bạn kê trong ngày này.</div>}
                </div>
            )}

            {/* Gọi Modal Chi tiết / Cập nhật */}
            {modalConfig.isOpen && (
                <PrescriptionDetailModal
                    mode={modalConfig.mode}
                    initialData={modalConfig.data}
                    onClose={() => {
                        setModalConfig({ isOpen: false, mode: 'view', data: null });
                        fetchPrescriptions(); // Refresh lại danh sách sau khi chỉnh sửa xong và đóng modal
                    }}
                />
            )}
        </div>
    );
};

export default PrescriptionListPage;