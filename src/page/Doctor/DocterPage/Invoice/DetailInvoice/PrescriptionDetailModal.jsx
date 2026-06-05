import React, { useState, useEffect } from 'react';
import apiClient from '../../../../../api/api';
import styles from './PrescriptionDetailModal.module.css';

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

  // 1. XỬ LÝ TỰ ĐỘNG LOAD THÔNG TIN THEO MÃ LỊCH KHÁM
  const handleCheckAppointment = async () => {
    if (!formData.maLichKham) {
      return alert("Vui lòng nhập Mã lịch khám trước khi kiểm tra!");
    }
    try {
      const res = await apiClient.get(`/api/v1/doctor-schedules/${formData.maLichKham}`);
      const data = res.data;

      setFormData(prev => ({
        ...prev,
        maBenhNhan: data.maBenhNhan,
        maBacSi: data.maBacSi || localStorage.getItem('maBacSi'),
        tenBenhNhan: data.tenBenhNhan,
        sdtBenhNhan: data.sdtBenhNhan,
        tenBacSi: data.tenBacSi,
        tenPhongKham: data.tenPhongKham
      }));
      alert("Đã đồng bộ thông tin lịch khám thành công!");
    } catch (error) {
      console.error(error);
      alert("Không tìm thấy thông tin lịch khám: " + (error.response?.data || error.message));
    }
  };

  // Thêm thuốc mới vào danh sách mảng tạm thời
  const handleAddDrugRow = () => {
    if (!newDrug.tenThuoc.trim()) return alert("Vui lòng nhập tên thuốc!");
    setFormData(prev => ({
      ...prev,
      danhSachThuoc: [...(prev.danhSachThuoc || []), { ...newDrug }]
    }));
    setNewDrug({ tenThuoc: '', donVi: 'Viên', soLuong: 1, lieuDung: '', ghiChu: '' });
  };

  // Xóa bớt thuốc khỏi danh sách
  const handleRemoveDrugRow = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      danhSachThuoc: prev.danhSachThuoc.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // 2. HÀM GỬI ĐỮ LIỆU JSON LÊN SERVER (KHÔNG DÙNG FORMDATA NỮA)
  const handleSaveSubmit = async () => {
    try {
      const synchronizedData = {
        ...formData,
        ghiChuHoSo: formData.ghiChu || formData.ghiChuHoSo || ""
      };

      if (currentMode === 'create') {
        if (!formData.maLichKham) return alert("Vui lòng điền và kiểm tra Mã lịch khám liên kết!");

        // GỬI CHUẨN JSON THUẦN
        const res = await apiClient.post('/api/v1/prescription/create', synchronizedData);

        alert("Tạo đơn thuốc thành công!");

        // Nhận dữ liệu tự động sinh từ Backend (Chứa maHoSo và maSoDonThuoc) cập nhật lại giao diện
        setFormData(prev => ({
          ...prev,
          maHoSo: res.data.maHoSo,
          maSoDonThuoc: res.data.maSoDonThuoc
        }));

      } else if (currentMode === 'edit') {
        // GỬI CHUẨN JSON THUẦN QUA METHOD PUT
        console.log(synchronizedData.danhSachThuoc);

        const res = await apiClient.put(`/api/v1/prescription/update/${formData.maSoDonThuoc}`, synchronizedData);

        // Đồng bộ dữ liệu mới nhất (giữ nguyên bộ khung mã cũ)
        setFormData(prev => ({
          ...prev,
          ...res.data
        }));

        alert("Cập nhật đơn thuốc thành công!");
      }

      onClose(); // Đóng modal sau khi hoàn tất thao tác
    } catch (error) {
      console.error(error);
      alert("Xử lý thất bại: " + (error.response?.data?.error || error.response?.data?.message || error.message));
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
              <h3 className={styles.clinicName}>{formData.tenPhongKham || "Hệ thống phòng khám Booking Clinic"}</h3>
              <p className={styles.clinicDoctorInfo}>
                Bác sĩ chỉ định: <strong>{formData.tenBacSi || localStorage.getItem('hoVaTen') || "Bác sĩ phụ trách"}</strong>
              </p>

              {/* Ô NHẬP MÃ LỊCH KHÁM TỰ ĐỘNG ĐỒNG BỘ */}
              {currentMode === 'create' && (
                <div className={styles.clinicInputGroupFlex}>
                  <label className={styles.appointmentLabel}>Mã Lịch Khám:</label>
                  <input
                    type="text"
                    name="maLichKham"
                    value={formData.maLichKham || ""}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Nhập mã lịch khám..."
                  />
                  <button
                    type="button"
                    onClick={handleCheckAppointment}
                    className={styles.btnCheckAppointment}
                  >
                    Kiểm tra
                  </button>
                </div>
              )}
            </div>

            {/* THÔNG TIN MÃ HỒ SƠ & ĐƠN THUỐC */}
            <div className={styles.invoiceMetaCard}>
              <div className={styles.metaCardTitle}>HỒ SƠ & ĐƠN THUỐC</div>
              <div className={styles.metaInputGroup}>
                <label>Mã hồ sơ:</label>
                <input type="text" readOnly value={formData.maHoSo || "Tự động sinh"} className={`${styles.formInputBold} ${styles.inputProfileId}`} />
              </div>
              <div className={`${styles.metaInputGroup} ${styles.metaInputGroupSpacing}`}>
                <label>Mã đơn thuốc:</label>
                <input type="text" readOnly value={formData.maSoDonThuoc || "Tự động sinh"} className={`${styles.formInput} ${styles.inputPrescriptionId}`} />
              </div>
            </div>
          </div>

          {/* HỒ SƠ LÂM SÀNG BỆNH NHÂN */}
          <div className={styles.sectionDividerTitle}>Thông tin bệnh lý lâm sàng</div>
          <div className={styles.patientFormGrid}>
            <div className={styles.inputFieldBlock}>
              <label>Tên bệnh nhân</label>
              <input
                type="text"
                name="tenBenhNhan"
                readOnly={currentMode === 'view' || currentMode === 'create'}
                value={formData.tenBenhNhan || ""}
                onChange={handleInputChange}
                className={`${styles.formInput} ${currentMode === 'create' ? styles.inputDisabled : ''}`}
              />
            </div>
            <div className={styles.inputFieldBlock}>
              <label>Số điện thoại</label>
              <input
                type="text"
                name="sdtBenhNhan"
                readOnly={currentMode === 'view' || currentMode === 'create'}
                value={formData.sdtBenhNhan || ""}
                onChange={handleInputChange}
                className={`${styles.formInput} ${currentMode === 'create' ? styles.inputDisabled : ''}`}
              />
            </div>
            <div className={`${styles.inputFieldBlock} ${styles.fullWidthRow}`}>
              <label>Triệu chứng lâm sàng</label>
              <input type="text" name="trieuChung" readOnly={currentMode === 'view'} value={formData.trieuChung || ""} onChange={handleInputChange} className={styles.formInput} />
            </div>
            <div className={`${styles.inputFieldBlock} ${styles.fullWidthRow}`}>
              <label>Chẩn đoán bệnh</label>
              <input type="text" name="chuanDoan" readOnly={currentMode === 'view'} value={formData.chuanDoan || ""} onChange={handleInputChange} className={`${styles.formInput} ${styles.inputDiagnosis}`} />
            </div>
          </div>

          {/* DANH MỤC THUỐC ĐỘNG */}
          <div className={styles.tableHeaderSection}>
            <div className={styles.sectionDividerTitle}>Danh mục thuốc được chỉ định</div>
          </div>

          <table className={styles.drugFormTable}>
            <thead>
              <tr>
                <th className={styles.thStt}>STT</th>
                <th>Tên Thuốc</th>
                <th className={styles.thUnit}>Đơn vị</th>
                <th className={styles.thQuantity}>S.Lượng</th>
                <th>Liều dùng</th>
                <th>Ghi chú</th>
                {currentMode !== 'view' && <th className={`${styles.thDelete} no-print`}>Xóa</th>}
              </tr>
            </thead>
            <tbody>
              {formData.danhSachThuoc && formData.danhSachThuoc.map((thuoc, index) => (
                <tr key={index}>
                  <td className={styles.textCenter}>{index + 1}</td>
                  <td className={styles.tdDrugName}>{thuoc.tenThuoc}</td>
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

              {currentMode !== 'view' && (
                <tr className={`${styles.trAddRow} no-print`}>
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
                  <td><button type="button" onClick={handleAddDrugRow} className={styles.btnAddNewDrug}>+</button></td>
                </tr>
              )}
            </tbody>
          </table>

          {/* DẶN DÒ & KẾT LUẬN */}
          <div className={`${styles.sectionDividerTitle} ${styles.sectionDividerSpacing}`}>Kết luận & Dặn dò hướng dẫn</div>
          <div className={styles.conclusionGrid}>
            <div className={styles.inputFieldBlock}>
              <label>Kết luận khám</label>
              <textarea name="ketLuan" readOnly={currentMode === 'view'} value={formData.ketLuan || ""} onChange={handleInputChange} className={styles.formTextarea} />
            </div>
            <div className={styles.inputFieldBlock}>
              <label>Ghi chú đơn thuốc (Ghi chú hồ sơ)</label>
              <textarea name="ghiChu" readOnly={currentMode === 'view'} value={formData.ghiChu || formData.ghiChuHoSo || ""} onChange={handleInputChange} className={styles.formTextarea} />
            </div>
          </div>
        </div>

        {/* PHẦN FOOTER CHỨA CÁC NÚT THAO TÁC */}
        <div className={`${styles.modalFooter} no-print`}>
          <button type="button" onClick={onClose} className={styles.btnFooterClose}>
            Đóng
          </button>

          {currentMode !== 'view' && (
            <button type="button" onClick={handleSaveSubmit} className={styles.btnFooterSave}>
              <i className="fa-solid fa-floppy-disk"></i> Lưu dữ liệu đơn
            </button>
          )}

          {currentMode === 'view' && (
            <button type="button" onClick={() => window.print()} className={styles.btnFooterPrint}>
              <i className="fa-solid fa-print"></i> In đơn thuốc
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PrescriptionDetailModal;