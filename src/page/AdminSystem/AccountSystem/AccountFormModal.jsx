import React, { useState, useEffect } from "react";
import styles from "./AccountManager.module.css";
import accountService from "../../../services/admin/AccountService";

const AccountFormModal = ({ initialData, onClose, onSuccess }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    hoVaTen: "",
    soDt: "",
    email: "",
    matKhau: "",
    vaiTro: "BenhNhan",
    trangThai: true,
    anhDaiDien: "" 
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        hoVaTen: initialData.hoVaTen || "",
        soDt: initialData.soDt || "",
        email: initialData.email || "",
        matKhau: "", // Để trống khi edit, nếu nhập sẽ là đổi pass mới
        vaiTro: initialData.vaiTro || "BenhNhan",
        trangThai: initialData.trangThai !== undefined ? initialData.trangThai : true,
        anhDaiDien: "" // Reset file ảnh mỗi lần mở form
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  // HÀM MỚI: Xử lý khi người dùng chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, anhDaiDien: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hoVaTen || !formData.soDt) {
      alert("Họ tên và Số điện thoại không được để trống!");
      return;
    }

    // CHUYỂN ĐỔI SANG FORMDATA ĐỂ GỬI ĐƯỢC FILE
    const payload = new FormData();
    payload.append("hoVaTen", formData.hoVaTen);
    payload.append("soDt", formData.soDt);
    payload.append("vaiTro", formData.vaiTro);
    payload.append("trangThai", formData.trangThai);
    
    if (formData.email) {
      payload.append("email", formData.email);
    }
    
    // Chỉ gửi mật khẩu nếu người dùng có nhập (để Backend check đổi mật khẩu)
    if (formData.matKhau && formData.matKhau.trim() !== "") {
      payload.append("matKhau", formData.matKhau);
    }

    // Append file vật lý nếu có chọn
    if (formData.anhDaiDien instanceof File) {
      payload.append("anhDaiDien", formData.anhDaiDien);
    }

    try {
      if (isEditMode) {
        await accountService.updateAccount(initialData.maTaiKhoan, payload);
        alert("Cập nhật tài khoản thành công!");
      } else {
        await accountService.createAccount(payload);
        alert("Tạo tài khoản thành công! Hệ thống sẽ gửi email cấp tài khoản.");
      }
      onSuccess(); 
    } catch (error) {
      console.error("Lỗi khi lưu tài khoản:", error);
      alert(error.response?.data || "Đã xảy ra lỗi hệ thống, vui lòng kiểm tra lại thông tin hoặc xem Console (F12)!");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            
            <div style={{display: 'flex', gap: '15px'}}>
              <div className={styles.formGroup} style={{flex: 2}}>
                <label>Họ và Tên <span style={{color:'red'}}>*</span></label>
                <input 
                  type="text" name="hoVaTen" 
                  value={formData.hoVaTen} onChange={handleChange} 
                  className={styles.formInput} 
                  placeholder="Nhập họ và tên..." 
                />
              </div>

              {/* GIAO DIỆN MỚI: Thêm input chọn file ảnh */}
              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Ảnh đại diện (Tùy chọn)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange} 
                  className={styles.formInput} 
                  style={{padding: '7px'}} // Chỉnh padding nhỏ lại cho vừa file input
                />
              </div>
            </div>

            <div style={{display: 'flex', gap: '15px'}}>
              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Số điện thoại <span style={{color:'red'}}>*</span></label>
                <input 
                  type="text" name="soDt" 
                  value={formData.soDt} onChange={handleChange} 
                  className={styles.formInput} 
                  placeholder="Nhập số điện thoại..." 
                />
              </div>

              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Email liên hệ</label>
                <input 
                  type="email" name="email" 
                  value={formData.email} onChange={handleChange} 
                  className={styles.formInput} 
                  placeholder="Nhập email..." 
                />
              </div>
            </div>

            <div style={{display: 'flex', gap: '15px'}}>
              <div className={styles.formGroup} style={{flex: 1}}>
                <label>Vai trò hệ thống</label>
                <select name="vaiTro" value={formData.vaiTro} onChange={handleChange} className={styles.formSelect}>
                  <option value="Admin">Quản trị viên (Admin)</option>
                  <option value="PhongKham">Phòng Khám</option>
                  <option value="BacSi">Bác Sĩ</option>
                  <option value="BenhNhan">Bệnh Nhân</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{flex: 1}}>
                <label>{isEditMode ? "Đổi mật khẩu (Bỏ trống nếu không đổi)" : "Mật khẩu khởi tạo"}</label>
                <input 
                  type="password" name="matKhau" 
                  value={formData.matKhau} onChange={handleChange} 
                  className={styles.formInput} 
                  placeholder={isEditMode ? "Nhập mật khẩu mới..." : "Mặc định: 123456"} 
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{flexDirection: 'row', alignItems: 'center', marginTop: '10px'}}>
              <input 
                type="checkbox" 
                id="trangThai" 
                name="trangThai" 
                checked={formData.trangThai} 
                onChange={handleChange} 
                style={{width: '18px', height: '18px', cursor: 'pointer'}}
              />
              <label htmlFor="trangThai" style={{cursor: 'pointer', margin: 0}}>Kích hoạt tài khoản (Được phép đăng nhập)</label>
            </div>

          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Hủy bỏ</button>
            <button type="submit" className={styles.btnSubmit}>
              {isEditMode ? "Lưu thay đổi" : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountFormModal;