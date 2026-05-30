import React, { useState } from 'react';
import axios from 'axios';
import apiClient from '../../../../../../api/api';
import styles from '../../PatientManagement.module.css'; // Dùng chung file CSS hoặc tạo mới

const EditHealthModal = ({ patient, onClose, onUpdateSuccess }) => {
    // Chỉ lấy 4 trường cần thiết đẩy vào form
    const [formData, setFormData] = useState({
        maBenhNhan: patient.maBenhNhan, // Bắt buộc gửi kèm ID để BE biết update ai
        chieuCao: patient.chieuCao || '',
        canNang: patient.canNang || '',
        nhomMau: patient.nhomMau || '',
        diUngThuoc: patient.diUngThuoc || ''
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Gọi API update
            const response = await apiClient.put('/api/v1/patient/update', formData);
            onUpdateSuccess(response.data); // Cập nhật lại UI
        } catch (error) {
            alert("Cập nhật thất bại, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Cập nhật thông tin sức khỏe</h3>
                <form onSubmit={handleSubmit} className={styles.formGrid}>

                    <div className={styles.formGroup}>
                        <label>Chiều cao (cm)</label>
                        <input type="number" name="chieuCao" value={formData.chieuCao} onChange={handleInputChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Cân nặng (kg)</label>
                        <input type="number" name="canNang" value={formData.canNang} onChange={handleInputChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Nhóm máu</label>
                        <select name="nhomMau" value={formData.nhomMau} onChange={handleInputChange}>
                            <option value="">Chưa rõ</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="O">O</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Dị ứng thuốc</label>
                        <input type="text" name="diUngThuoc" value={formData.diUngThuoc} onChange={handleInputChange} placeholder="VD: Penicillin..." />
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} disabled={loading} className={styles.cancelBtn}>Hủy</button>
                        <button type="submit" disabled={loading} className={styles.saveBtn}>
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditHealthModal;