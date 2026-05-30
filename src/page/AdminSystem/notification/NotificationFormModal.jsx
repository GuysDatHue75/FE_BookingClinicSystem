import React, { useState, useEffect } from "react";
import styles from "./NotificationManager.module.css";
import notificationService from "../../../services/admin/NotificationService";

const NotificationFormModal = ({ initialData, onClose, onSuccess }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    tieuDe: "",
    loaiThongBao: "Bảo trì",
    doiTuongNhan: "Tất cả người dùng",
    noiDung: "",
    files: "",       // Sẽ lưu chuỗi Base64 của file PDF
    anhThongBao: ""  // Sẽ lưu chuỗi Base64 của hình ảnh
  });

  // State chuyên biệt cho danh sách người nhận (Tag Input)
  const [danhSachNguoiNhan, setDanhSachNguoiNhan] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        tieuDe: initialData.tieuDe || "",
        loaiThongBao: initialData.loaiThongBao || "Bảo trì",
        doiTuongNhan: initialData.doiTuongNhan || "Tất cả người dùng",
        noiDung: initialData.noiDung || "",
        files: initialData.files || "",
        anhThongBao: initialData.anhThongBao || ""
      });
      setDanhSachNguoiNhan(initialData.danhSachNguoiNhan || []);
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💥 XỬ LÝ TAG INPUT (Thêm người nhận khi ấn Enter)
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Chống submit form
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

  // 💥 XỬ LÝ FILE UPLOAD (Chuyển File thành chuỗi String Base64 để khớp với DTO)
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result là 1 chuỗi String (Base64) chứa nội dung file
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tieuDe || !formData.noiDung) {
      alert("Tiêu đề và nội dung không được để trống!");
      return;
    }

    const actualUserId = localStorage.getItem('idAccount') || "ADMIN_MAC_DINH";
    // const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    // const actualUserId = currentUser.maTaiKhoan || currentUser.id || "ADMIN_MAC_DINH";

    const payload = {
      maThongBao: isEditMode ? initialData.maThongBao : null,
      maTaiKhoan: actualUserId,
      tieuDe: formData.tieuDe,
      noiDung: formData.noiDung,
      loaiThongBao: formData.loaiThongBao,
      doiTuongNhan: formData.doiTuongNhan,
      danhSachNguoiNhan: danhSachNguoiNhan, // 💥 Truyền mảng danh sách người nhận vào đây
      thoiGianGui: new Date().toISOString().substring(0, 19),
      files: formData.files,             // 💥 Gửi chuỗi string file lên
      anhThongBao: formData.anhThongBao  // 💥 Gửi chuỗi string ảnh lên
    };

    try {
      if (isEditMode) {
        await notificationService.updateNotification(payload);
        alert("Cập nhật thông báo thành công!");
      } else {
        await notificationService.createNotification(payload);
        alert("Tạo thông báo thành công!");
      }
      onSuccess(); 
    } catch (error) {
      console.error("Lỗi khi lưu thông báo:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Chỉnh sửa thông báo" : "Viết thông báo mới"}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            
            <div className={styles.formGroup}>
              <label>Tiêu đề thông báo <span style={{color:'red'}}>*</span></label>
              <input 
                type="text" name="tieuDe" 
                value={formData.tieuDe} onChange={handleChange} 
                className={styles.formInput} 
                placeholder="Nhập tiêu đề..." 
              />
            </div>

            <div style={{display: 'flex', gap: '15px'}}>
              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Loại thông báo</label>
                <select name="loaiThongBao" value={formData.loaiThongBao} onChange={handleChange} className={styles.formSelect}>
                  <option value="Bảo trì">Bảo trì hệ thống</option>
                  <option value="Cập nhật">Cập nhật tính năng</option>
                  <option value="Khuyến mãi">Chương trình khuyến mãi</option>
                  <option value="Cảnh báo">Cảnh báo bảo mật</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Gửi theo nhóm đối tượng</label>
                <select name="doiTuongNhan" value={formData.doiTuongNhan} onChange={handleChange} className={styles.formSelect}>
                  <option value="all">Tất cả người dùng</option>
                  <option value="PhongKham">Dành riêng cho Phòng khám</option>
                  <option value="BacSi">Dành riêng cho Bác sĩ</option>
                  <option value="BenhNhan">Dành riêng cho Bệnh nhân</option>
                </select>
              </div>
            </div>

            {/* 💥 TRƯỜNG NHẬP DANH SÁCH NGƯỜI NHẬN (TAG INPUT) */}
            <div className={styles.formGroup}>
              <label>Hoặc gửi đích danh (Nhập tên/mã và ấn Enter)</label>
              <div className={styles.tagInputContainer}>
                {danhSachNguoiNhan.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    <span className={styles.tagRemove} onClick={() => handleRemoveTag(tag)}>×</span>
                    {tag}
                  </span>
                ))}
                <input 
                  type="text" 
                  value={tagInputValue}
                  onChange={(e) => setTagInputValue(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className={styles.tagInput}
                  placeholder={danhSachNguoiNhan.length === 0 ? "Nhập tên người nhận..." : ""}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Nội dung chi tiết <span style={{color:'red'}}>*</span></label>
              <textarea 
                name="noiDung" 
                value={formData.noiDung} onChange={handleChange} 
                className={styles.formTextarea} 
                placeholder="Nhập nội dung thông báo..." 
              />
            </div>

            {/* 💥 FILE UPLOADS CHO ẢNH VÀ PDF */}
            <div style={{display: 'flex', gap: '15px'}}>
              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Ảnh đính kèm (Hình ảnh)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'anhThongBao')} 
                  className={styles.formInput} 
                />
              </div>
              
              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Tài liệu đính kèm (PDF)</label>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, 'files')} 
                  className={styles.formInput} 
                />
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