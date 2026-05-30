import React, { useState, useEffect } from "react";
import styles from "./NotificationEditer.module.css";
import notificationService from "../../../services/clinic/NottificationService";

const NotificationFormModal = ({ initialData, onClose, onSuccess }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    tieuDe: "",
    loaiThongBao: "Thông tin",
    doiTuongNhan: "", // 💥 Đặt mặc định là chuỗi rỗng để đại diện cho "Tất cả"
    noiDung: "",
    files: null,
    anhThongBao: null
  });

  const [danhSachNguoiNhan, setDanhSachNguoiNhan] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        tieuDe: initialData.tieuDe || "",
        loaiThongBao: initialData.loaiThongBao || "Thông tin",
        doiTuongNhan: initialData.doiTuongNhan || "", // 💥 Map lại chuỗi rỗng nếu không có đối tượng cụ thể
        noiDung: initialData.noiDung || "",
        files: initialData.files || null, 
        anhThongBao: initialData.anhThongBao || null 
      });
      setDanhSachNguoiNhan(initialData.danhSachNguoiNhan || []);
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      const newTag = tagInputValue.trim();
      if (newTag && !danhSachNguoiNhan.includes(newTag)) {
        setDanhSachNguoiNhan([...danhSachNguoiNhan, newTag]);
      }
      setTagInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setDanhSachNguoiNhan(danhSachNguoiNhan.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tieuDe || !formData.noiDung) {
      alert("Tiêu đề và nội dung không được để trống!");
      return;
    }

    const actualUserId = localStorage.getItem('idAccount') || "CLINIC_ADMIN";

    const payload = new FormData();
    payload.append("maTaiKhoan", actualUserId);
    payload.append("tieuDe", formData.tieuDe);
    payload.append("noiDung", formData.noiDung);
    payload.append("loaiThongBao", formData.loaiThongBao);
    
    // 💥 Nếu là rỗng (Tất cả), cứ gửi chuỗi rỗng lên để Backend xử lý getAll
    payload.append("doiTuongNhan", formData.doiTuongNhan);

    danhSachNguoiNhan.forEach(tag => {
        payload.append("danhSachNguoiNhan", tag);
    });

    if (formData.files instanceof File) {
        payload.append("files", formData.files);
    }
    if (formData.anhThongBao instanceof File) {
        payload.append("anhThongBao", formData.anhThongBao);
    }

    try {
      if (isEditMode) {
        await notificationService.updateNotification(initialData.maThongBao, payload);
        alert("Cập nhật thông báo thành công!");
      } else {
        await notificationService.createNotification(payload);
        alert("Tạo thông báo thành công!");
      }
      onSuccess(); 
    } catch (error) {
      console.error("Lỗi khi lưu thông báo:", error);
      alert("Đã xảy ra lỗi, vui lòng kiểm tra lại hệ thống!");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={{ maxWidth: '800px' }}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Chỉnh sửa thông báo" : "Viết thông báo mới"}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            
            <div className={styles.formGroup}>
              <label>Tiêu đề thông báo <span style={{color:'red'}}>*</span></label>
              <input type="text" name="tieuDe" value={formData.tieuDe} onChange={handleChange} className={styles.formInput} placeholder="Nhập tiêu đề..." />
            </div>

            <div style={{display: 'flex', gap: '15px'}}>
              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Loại thông báo</label>
                <select name="loaiThongBao" value={formData.loaiThongBao} onChange={handleChange} className={styles.formSelect}>
                  <option value="Thông tin">Thông tin chung</option>
                  <option value="Bảo trì">Bảo trì hệ thống</option>
                  <option value="Cập nhật">Cập nhật tính năng</option>
                  <option value="Khuyến mãi">Chương trình khuyến mãi</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Gửi theo nhóm đối tượng</label>
                <select name="doiTuongNhan" value={formData.doiTuongNhan} onChange={handleChange} className={styles.formSelect}>
                  {/* 💥 Value rỗng đại diện cho "Tất cả" */}
                  <option value="">Tất cả người dùng</option>
                  <option value="BacSi">Bác sĩ</option>
                  <option value="BenhNhan">Bệnh nhân</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Hoặc gửi đích danh (Nhập mã tài khoản và ấn Enter)</label>
              <div className={styles.tagInputContainer}>
                {danhSachNguoiNhan.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    <span className={styles.tagRemove} onClick={() => handleRemoveTag(tag)}>×</span>
                    {tag}
                  </span>
                ))}
                <input 
                  type="text" value={tagInputValue} onChange={(e) => setTagInputValue(e.target.value)} onKeyDown={handleTagKeyDown}
                  className={styles.tagInput} placeholder={danhSachNguoiNhan.length === 0 ? "Nhập mã..." : ""}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Nội dung chi tiết <span style={{color:'red'}}>*</span></label>
              <textarea name="noiDung" value={formData.noiDung} onChange={handleChange} className={styles.formTextarea} placeholder="Nhập nội dung thông báo..." rows="5" />
            </div>

            <div style={{display: 'flex', gap: '15px'}}>
              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Ảnh đính kèm (Hình ảnh)</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'anhThongBao')} className={styles.formInput} />
                {typeof formData.anhThongBao === 'string' && (
                    <span style={{fontSize: '12px', color: '#3b82f6'}}>Đã có ảnh, chọn file mới để thay thế</span>
                )}
              </div>
              
              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Tài liệu đính kèm (PDF)</label>
                <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'files')} className={styles.formInput} />
                {typeof formData.files === 'string' && (
                    <span style={{fontSize: '12px', color: '#3b82f6'}}>Đã có tài liệu, chọn file mới để thay thế</span>
                )}
              </div>
            </div>

          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Hủy bỏ</button>
            <button type="submit" className={styles.btnSubmit}>
              {isEditMode ? "Lưu thay đổi" : "Gửi thông báo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationFormModal;