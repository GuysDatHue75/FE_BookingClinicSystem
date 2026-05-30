import React, { useState, useEffect } from 'react';
import apiClient from '../../../../api/api';
import styles from './Invoice.module.css';

const PrescriptionDetailModal = ({ mode, initialData, onClose }) => {
  const [currentMode, setCurrentMode] = useState(mode); // 'view', 'edit', 'create'
  const [formData, setFormData] = useState({ ...initialData });
  const [newDrug, setNewDrug] = useState({ tenThuoc: '', donVi: 'Viên', soLuong: 1, lieuDung: '', ghiChu: '' });

  useEffect(() => {
    setFormData({ ...initialData });
  }, [initialData]);

  // Xử lý thay đổi dữ liệu text thông thường
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Thêm thuốc mới vào danh sách mảng tạm thời
  const handleAddDrugRow = () => {
    if (!newDrug.tenThuoc.trim()) return alert("Vui lòng nhập tên thuốc!");
    setFormData(prev => ({
      ...prev,
      danhSachThuoc: [...(prev.danhSachThuoc || []), { ...newDrug }]
    }));
    setNewDrug({ tenThuoc: '', donVi: 'Viên', soLuong: 1, lieuDung: '', ghiChu: '' }); // Reset ô nhập thuốc
  };

  // Xóa bớt thuốc khỏi danh sách
  const handleRemoveDrugRow = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      danhSachThuoc: prev.danhSachThuoc.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Hàm thực thi bấm gửi API Lưu / Cập nhật lên Spring Boot
  const handleSaveSubmit = async () => {
    try {
      if (currentMode === 'create') {
        if (!formData.maLichKham) return alert("Vui lòng điền Mã lịch khám liên kết!");
        // Gọi API POST tạo đơn thuốc mới
        const res = await apiClient.post('/api/v1/prescription/create', formData);
        alert(res.data);
      } else if (currentMode === 'edit') {
        // Gọi API PUT cập nhật đơn thuốc dựa trên maSoDonThuoc
        const res = await apiClient.put(`/api/v1/prescription/update/${formData.maSoDonThuoc}`, formData);
        alert("Cập nhật đơn thuốc thành công!");
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert("Xử lý thất bại: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>

        {/* THANH ĐIỀU HƯỚNG SỰ KIỆN */}
        <div className={`${styles.detailTopHeader} no-print`}>
          <span className={styles.detailTitle}>
            {currentMode === 'create' ? 'Tạo đơn thuốc mới' : currentMode === 'edit' ? 'Chỉnh sửa đơn thuốc' : 'Chi tiết đơn thuốc'}
          </span>
          <div className={styles.topActions}>
            {currentMode === 'view' && (
              <button className={styles.btnUpdateTop} onClick={() => setCurrentMode('edit')}>
                <i className="fa-regular fa-pen-to-square"></i> Sửa đơn
              </button>
            )}
            <button className={styles.btnCloseModal} onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
          </div>
        </div>

        {/* KHUNG KHÁM BỆNH ĐIỆN TỬ */}
        <div id="print-area" className={styles.formMainContainer}>
          <div className={styles.formHeaderRow}>
            <div className={styles.clinicDetails}>
              <h3 className={styles.clinicName}>Hệ thống phòng khám Booking Clinic</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#666' }}>Bác sĩ chỉ định: <strong>{formData.tenBacSi || localStorage.getItem('hoVaTen') || "Bác sĩ phụ trách"}</strong></p>
              {currentMode === 'create' && (
                <div className={styles.clinicInputGroup}>
                  <label style={{ width: '90px' }}>Mã Lịch Khám:</label>
                  <input type="text" name="maLichKham" value={formData.maLichKham || ""} onChange={handleInputChange} className={styles.formInput} placeholder="Nhập mã lịch khám để hoàn tất cuộc hẹn..." />
                </div>
              )}
            </div>

            <div className={styles.invoiceMetaCard}>
              <div className={styles.metaCardTitle}>BIỂU MẪU ĐIỆN TỬ</div>
              <div className={styles.metaInputGroup}>
                <label>Mã Số:</label>
                <input type="text" readOnly value={formData.maSoDonThuoc || "Tự động sinh"} className={styles.formInputBold} />
              </div>
            </div>
          </div>

          {/* HỒ SƠ LÂM SÀNG BỆNH NHÂN */}
          <div className={styles.sectionDividerTitle}>Thông tin bệnh lý lâm sàng</div>
          <div className={styles.patientFormGrid}>
            <div className={styles.inputFieldBlock}>
              <label>Tên bệnh nhân</label>
              <input type="text" name="tenBenhNhan" readOnly={currentMode === 'view'} value={formData.tenBenhNhan || ""} onChange={handleInputChange} className={styles.formInput} />
            </div>
            <div className={styles.inputFieldBlock}>
              <label>Số điện thoại</label>
              <input type="text" name="sdtBenhNhan" readOnly={currentMode === 'view'} value={formData.sdtBenhNhan || ""} onChange={handleInputChange} className={styles.formInput} />
            </div>
            <div className={`${styles.inputFieldBlock} ${styles.fullWidthRow}`}>
              <label>Triệu chứng lâm sàng</label>
              <input type="text" name="trieuChung" readOnly={currentMode === 'view'} value={formData.trieuChung || ""} onChange={handleInputChange} className={styles.formInput} />
            </div>
            <div className={`${styles.inputFieldBlock} ${styles.fullWidthRow}`}>
              <label>Chẩn đoán bệnh</label>
              <input type="text" name="chuanDoan" readOnly={currentMode === 'view'} value={formData.chuanDoan || ""} onChange={handleInputChange} className={styles.formInput} style={{ fontWeight: '600', color: '#0066ff' }} />
            </div>
          </div>

          {/* QUẢN LÝ THÊM BỚT DANH MỤC THUỐC ĐỘNG */}
          <div className={styles.tableHeaderSection}>
            <div className={styles.sectionDividerTitle}>Danh mục thuốc được chỉ định</div>
          </div>

          <table className={styles.drugFormTable}>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>STT</th>
                <th>Tên Thuốc</th>
                <th style={{ width: '90px' }}>Đơn vị</th>
                <th style={{ width: '80px', textAlign: 'center' }}>S.Lượng</th>
                <th>Liều dùng</th>
                <th>Ghi chú</th>
                {currentMode !== 'view' && <th style={{ width: '40px' }} className="no-print">Xóa</th>}
              </tr>
            </thead>
            <tbody>
              {formData.danhSachThuoc && formData.danhSachThuoc.map((thuoc, index) => (
                <tr key={index}>
                  <td className={styles.textCenter}>{index + 1}</td>
                  <td style={{ fontWeight: '600' }}>{thuoc.tenThuoc}</td>
                  <td>{thuoc.donVi}</td>
                  <td className={styles.textCenter}>{thuoc.soLuong}</td>
                  <td>{thuoc.lieuDung}</td>
                  <td>{thuoc.ghiChu}</td>
                  {currentMode !== 'view' && (
                    <td className="no-print textCenter">
                      <button type="button" onClick={() => handleRemoveDrugRow(index)} className={styles.btnDeleteRow}>×</button>
                    </td>
                  )}
                </tr>
              ))}

              {/* DÒNG NHẬP THUỐC MỚI (CHỈ XUẤT HIỆN KHI Ở CHẾ ĐỘ CREATE HOẶC EDIT) */}
              {currentMode !== 'view' && (
                <tr className="no-print" style={{ backgroundColor: '#fafafa' }}>
                  <td className={styles.textCenter}>+</td>
                  <td><input type="text" value={newDrug.tenThuoc} onChange={(e) => setNewDrug({ ...newDrug, tenThuoc: e.target.value })} placeholder="Nhập tên thuốc..." className={styles.tableInput} /></td>
                  <td>
                    <select value={newDrug.donVi} onChange={(e) => setNewDrug({ ...newDrug, donVi: e.target.value })} className={styles.tableSelect}>
                      <option value="Viên">Viên</option>
                      <option value="Chai">Chai</option>
                      <option value="Ống">Ống</option>
                      <option value="Gói">Gói</option>
                    </select>
                  </td>
                  <td><input type="number" min="1" value={newDrug.soLuong} onChange={(e) => setNewDrug({ ...newDrug, soLuong: parseInt(e.target.value) || 1 })} className={styles.tableInputCenter} /></td>
                  <td><input type="text" value={newDrug.lieuDung} onChange={(e) => setNewDrug({ ...newDrug, lieuDung: e.target.value })} placeholder="VD: Ngày 2 viên..." className={styles.tableInput} /></td>
                  <td><input type="text" value={newDrug.ghiChu} onChange={(e) => setNewDrug({ ...newDrug, ghiChu: e.target.value })} placeholder="Sau ăn..." className={styles.tableInput} /></td>
                  <td><button type="button" onClick={handleAddDrugRow} className={styles.btnAddDrugRow} style={{ backgroundColor: '#52c41a', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>+</button></td>
                </tr>
              )}
            </tbody>
          </table>

          {/* DẶN DÒ & KẾT LUẬN */}
          <div className={styles.sectionDividerTitle} style={{ marginTop: '20px' }}>Kết luận & Dặn dò hướng dẫn</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className={styles.inputFieldBlock}>
              <label>Kết luận khám</label>
              <textarea name="ketLuan" readOnly={currentMode === 'view'} value={formData.ketLuan || ""} onChange={handleInputChange} className={styles.formTextarea} />
            </div>
            <div className={styles.inputFieldBlock}>
              <label>Ghi chú đơn thuốc (Ghi chú hồ sơ)</label>
              <textarea name="ghiChu" readOnly={currentMode === 'view'} value={formData.ghiChu || formData.ghiChuHoSo || ""} onChange={handleInputChange} className={styles.formTextarea} />
            </div>
          </div>

          {/* KHU VỰC THAO TÁC GỬI LÊN SERVER */}
          <div className={`${styles.formBottomActions} no-print`}>
            {currentMode !== 'view' ? (
              <>
                <button type="button" className={styles.btnExecutePrint} style={{ backgroundColor: '#52c41a' }} onClick={handleSaveSubmit}>Lưu thông tin</button>
                <button type="button" className={styles.btnExecuteSave} onClick={() => setCurrentMode('view')}>Hủy</button>
              </>
            ) : (
              <>
                <button type="button" className={styles.btnExecutePrint} onClick={() => window.print()}>In đơn thuốc</button>
                <button type="button" className={styles.btnExecuteSave} onClick={onClose}>Đóng</button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailModal;