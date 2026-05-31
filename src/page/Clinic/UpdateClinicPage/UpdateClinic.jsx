import React, { useContext, useState, useEffect } from "react";
import styles from "./UpdateClinic.module.css";
import { toast } from "react-toastify";
import { State } from "../../../state/context";
import clinicsService from "../../../services/clinic/ClinicsService";

const UpdateClinic = ({ onClose }) => {
  const { profileClinic, setProfileClinic } = useContext(State);
  const [clinic, setClinic] = useState(profileClinic || {});
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profileClinic) {
      setClinic(profileClinic);
    }
  }, [profileClinic]);

  const clinicTypes = [
    "Phòng khám đa khoa tư nhân",
    "Phòng khám chuyên khoa",
    "Phòng khám tư nhân",
  ];

  // Xử lý thay đổi dữ liệu dạng Text/Date
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClinic((prev) => ({ ...prev, [name]: value }));
  };

  // 💥 MỚI: Xử lý khi chọn File (Ảnh, PDF)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      // Lưu trữ đối tượng File vào state để gửi lên server (cần FormData)
      setClinic((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  const validate = () => {
    const newErr = {};
    if (!clinic.tenPhongKham?.trim()) newErr.tenPhongKham = "Nhập tên phòng khám.";
    if (!clinic.loaiHinhPhongKham) newErr.loaiHinhPhongKham = "Chọn loại hình.";
    if (!clinic.diaChi?.trim()) newErr.diaChi = "Nhập địa chỉ.";
    if (!clinic.tinhThanhPho?.trim()) newErr.tinhThanhPho = "Nhập Tỉnh/Thành phố.";
    if (!clinic.email?.trim()) newErr.email = "Nhập email.";
    if (clinic.email && !/^\S+@\S+\.\S+$/.test(clinic.email)) newErr.email = "Email không hợp lệ.";
    if (!clinic.soDienThoai?.trim()) newErr.soDienThoai = "Nhập số điện thoại.";
    if (!clinic.nguoiDaiDien?.trim()) newErr.nguoiDaiDien = "Nhập người đại diện.";
    return newErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      // const formData = new FormData();

      // 1. Đẩy các trường văn bản (text) vào formData
      // Object.keys(clinic).forEach((key) => {
      //   // Bỏ qua 2 trường file vì sẽ xử lý riêng ở dưới
      //   if (key === 'anhPhongKham' || key === 'giayPhep') return;

      //   const value = clinic[key];
      //   // Chỉ đẩy data nếu có giá trị
      //   if (value !== null && value !== undefined) {
      //     formData.append(key, value);
      //   }
      // });
      // if (clinic.anhPhongKham instanceof File) {
      //   formData.append("anhPhongKham", clinic.anhPhongKham);
      // }
      
      // if (clinic.giayPhep instanceof File) {
      //   formData.append("giayPhep", clinic.giayPhep);
      // }
      await clinicsService.updateClinic(clinic.maPhongKham, clinic); // Nhớ đổi Header content-type bên Axios
      
      // // Tạm thời giữ nguyên lệnh gọi API hiện tại của bạn:
      // await clinicsService.updateClinic(clinic.maPhongKham, clinic);
      
      toast.success("Cập nhật phòng khám thành công.", {
        position: "top-center",
        autoClose: 2000,
      });
      
      // Update Context
      setProfileClinic(clinic);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      toast.error("Có lỗi khi cập nhật.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const Error = ({ msg }) => (msg ? <span className={styles.errorMsg}>{msg}</span> : null);

  return (
    <div className={styles.page} style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999,
      display: "flex", justifyContent: "center", alignItems: "center",
    }}>
      <div className={styles.card} style={{ 
        maxHeight: "90vh", overflowY: "auto", 
        width: "900px", maxWidth: "95%", position: "relative" 
      }}>
        
        <button onClick={onClose} style={{
          position: "absolute", top: "20px", right: "20px", 
          background: "none", border: "none", fontSize: "20px", 
          fontWeight: "bold", cursor: "pointer", color: "#666"
        }}>
          ✕
        </button>

        <h1 className={styles.title}>Cập nhật thông tin phòng khám</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <div className={styles.grid2}>
            {/* THÔNG TIN CHUNG */}
            <div className={styles.field}>
              <label>Mã PK (Không sửa)</label>
              <input name="maPhongKham" value={clinic.maPhongKham || ""} disabled style={{backgroundColor: '#f1f5f9'}}/>
            </div>
            <div className={styles.field}>
              <label>Tên phòng khám *</label>
              <input name="tenPhongKham" value={clinic.tenPhongKham || ""} onChange={handleChange} />
              <Error msg={errors.tenPhongKham} />
            </div>
            <div className={styles.field}>
              <label>Loại hình *</label>
              <select name="loaiHinhPhongKham" value={clinic.loaiHinhPhongKham || ""} onChange={handleChange}>
                <option value="">--Chọn--</option>
                {clinicTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <Error msg={errors.loaiHinhPhongKham} />
            </div>
            <div className={styles.field}>
              <label>Ngày thành lập *</label>
              <input type="date" name="ngayThanhLap" value={formatDateForInput(clinic.ngayThanhLap)} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Tỉnh / Thành phố *</label>
              <input name="tinhThanhPho" value={clinic.tinhThanhPho || ""} onChange={handleChange} />
              <Error msg={errors.tinhThanhPho} />
            </div>
            <div className={styles.field}>
              <label>Địa chỉ *</label>
              <input name="diaChi" value={clinic.diaChi || ""} onChange={handleChange} />
              <Error msg={errors.diaChi} />
            </div>
            <div className={styles.field}>
              <label>Email *</label>
              <input name="email" value={clinic.email || ""} onChange={handleChange} />
              <Error msg={errors.email} />
            </div>
            <div className={styles.field}>
              <label>SĐT *</label>
              <input name="soDienThoai" value={clinic.soDienThoai || ""} onChange={handleChange} />
              <Error msg={errors.soDienThoai} />
            </div>
            <div className={styles.field}>
              <label>Giờ bắt đầu làm việc</label>
              <input type="time" name="gioBatDauLamViec" value={clinic.gioBatDauLamViec || ""} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Giờ kết thúc làm việc</label>
              <input type="time" name="gioKetThucLamViec" value={clinic.gioKetThucLamViec || ""} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.fieldWide}>
            <label>Mô tả</label>
            <textarea rows={3} name="moTa" value={clinic.moTa || ""} onChange={handleChange} placeholder="Thông tin chi tiết về phòng khám..." />
          </div>

          <h2 className={styles.cardTitle} style={{marginTop: '20px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
            Pháp lý & Đại diện
          </h2>
          
          <div className={styles.grid2}>
            {/* 💥 MỚI BỔ SUNG CÁC TRƯỜNG PHÁP LÝ */}
            <div className={styles.field}>
              <label>Người đại diện *</label>
              <input name="nguoiDaiDien" value={clinic.nguoiDaiDien || ""} onChange={handleChange} />
              <Error msg={errors.nguoiDaiDien} />
            </div>
            <div className={styles.field}>
              <label>SĐT Người đại diện</label>
              <input name="soDienThoaiNguoiDaiDien" value={clinic.soDienThoaiNguoiDaiDien || ""} onChange={handleChange} />
            </div>
            
            <div className={styles.field}>
              <label>Ngày cấp (Giấy phép)</label>
              <input type="date" name="ngayCap" value={formatDateForInput(clinic.ngayCap)} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Nơi cấp</label>
              <input name="noiCap" value={clinic.noiCap || ""} onChange={handleChange} placeholder="Sở Y Tế..." />
            </div>

            {/* TRƯỜNG UPLOAD GIẤY PHÉP (PDF) */}
            <div className={styles.field}>
              <label>Upload Giấy phép (PDF)</label>
              {typeof clinic.giayPhep === 'string' && clinic.giayPhep && (
                 <a href={clinic.giayPhep} target="_blank" rel="noreferrer" style={{fontSize: '13px', color: 'blue', marginBottom: '5px'}}>
                   [Xem file hiện tại]
                 </a>
              )}
              <input type="file" name="giayPhep" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              <span className={styles.fileHint}>Hỗ trợ file .pdf, .doc</span>
            </div>

            {/* TRƯỜNG UPLOAD ẢNH PHÒNG KHÁM */}
            <div className={styles.field}>
              <label>Upload Ảnh phòng khám</label>
              {typeof clinic.anhPhongKham === 'string' && clinic.anhPhongKham && (
                 <img src={clinic.anhPhongKham} alt="Preview" style={{width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px', marginBottom: '5px'}}/>
              )}
              <input type="file" name="anhPhongKham" accept="image/*" onChange={handleFileChange} />
              <span className={styles.fileHint}>Hỗ trợ file .jpg, .png</span>
            </div>
          </div>

          <div className={styles.footer} style={{marginTop: '20px'}}>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateClinic;