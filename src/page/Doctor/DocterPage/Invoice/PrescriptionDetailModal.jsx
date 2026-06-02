import React, { useState, useEffect } from 'react';
import apiClient from '../../../../api/api';
import styles from './Invoice.module.css';

const PrescriptionDetailModal = ({ mode, initialData, onClose }) => {
  const [currentMode, setCurrentMode] = useState(mode); // 'view', 'edit', 'create'
  const [formData, setFormData] = useState({ ...initialData });
  const [newDrug, setNewDrug] = useState({ tenThuoc: '', donVi: 'Viên', soLuong: 1, lieuDung: '', ghiChu: '' });

  // Quản lý danh sách file ảnh upload và ảnh preview
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    setFormData({ ...initialData });
    // Reset file khi modal thay đổi dữ liệu
    setSelectedFiles([]);
    setImagePreviews([]);
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

      // Đổ dữ liệu trả về vào form state
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

  // 2. XỬ LÝ CHỌN FILE ẢNH (SIÊU ÂM, X-QUANG...)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Xóa ảnh đã chọn nếu chọn nhầm
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
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

  // 3. HÀM GỬI FORM DATA LÊN SERVER (MULTIPART/FORM-DATA)
  const handleSaveSubmit = async () => {
    try {
      if (currentMode === 'create') {
        if (!formData.maLichKham) return alert("Vui lòng điền và kiểm tra Mã lịch khám liên kết!");

        // Bắt buộc dùng FormData vì có chứa danh sách File đính kèm
        const formPayload = new FormData();

        // Đóng gói dữ liệu chữ thành JSON String nạp vào phần "data" đúng như Backend chờ (@RequestPart("data"))
        formPayload.append("data", JSON.stringify(formData));

        // Nạp danh sách file ảnh vào phần "files" đúng như biến @RequestPart("files")
        if (selectedFiles.length > 0) {
          selectedFiles.forEach((file) => {
            formPayload.append("files", file);
          });
        }

        // Thực thi gọi API với header multipart/form-data
        const res = await apiClient.post('/api/v1/prescription/create', formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        alert(res.data || "Tạo đơn thuốc thành công!");
      } else if (currentMode === 'edit') {
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
              <h3 className={styles.clinicName}>{formData.tenPhongKham || "Hệ thống phòng khám Booking Clinic"}</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#666' }}>
                Bác sĩ chỉ định: <strong>{formData.tenBacSi || localStorage.getItem('hoVaTen') || "Bác sĩ phụ trách"}</strong>
              </p>

              {/* Ô NHẬP MÃ LỊCH KHÁM CÓ NÚT KIỂM TRA CHUYÊN NGHIỆP */}
              {currentMode === 'create' && (
                <div className={styles.clinicInputGroup} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label style={{ width: '90px', flexShrink: 0 }}>Mã Lịch Khám:</label>
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
                    style={{ padding: '6px 12px', backgroundColor: '#0066ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    Kiểm tra
                  </button>
                </div>
              )}
            </div>

            {/* ĐÃ CẬP NHẬT HIỂN THỊ MÃ HỒ SƠ TẠI ĐÂY */}
            <div className={styles.invoiceMetaCard}>
              <div className={styles.metaCardTitle}>HỒ SƠ & ĐƠN THUỐC</div>
              <div className={styles.metaInputGroup}>
                <label>Mã hồ sơ:</label>
                <input type="text" readOnly value={formData.maHoSo || "Đang khởi tạo..."} className={styles.formInputBold} style={{ color: '#e02424' }} />
              </div>
              <div className={styles.metaInputGroup} style={{ marginTop: '6px' }}>
                <label>Mã đơn thuốc:</label>
                <input type="text" readOnly value={formData.maSoDonThuoc || "Tự động sinh"} className={styles.formInput} style={{ fontSize: '12px' }} />
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
                className={styles.formInput}
                style={(currentMode === 'create') ? { backgroundColor: '#f0f2f5', cursor: 'not-allowed' } : {}}
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
                className={styles.formInput}
                style={(currentMode === 'create') ? { backgroundColor: '#f0f2f5', cursor: 'not-allowed' } : {}}
              />
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

          {/* DANH MỤC THUỐC ĐỘNG */}
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

          {/* UPLOAD HÌNH ẢNH LÂM SÀNG */}
          {currentMode !== 'view' && (
            <div className="no-print" style={{ marginTop: '25px', padding: '15px', border: '1px dashed #d9d9d9', borderRadius: '6px', backgroundColor: '#faf0f6' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#722ed1' }}>
                <i className="fa-solid fa-image"></i> Tải lên hình ảnh kết quả kết luận (Siêu âm, X-Quang, Xét nghiệm...)
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ fontSize: '13px' }}
              />

              {imagePreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                  {imagePreviews.map((previewUrl, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '90px', height: '90px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(255, 0, 0, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* KHU VỰC THAO TÁC */}
          <div className={`${styles.formBottomActions} no-print`} style={{ marginTop: '25px' }}>
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