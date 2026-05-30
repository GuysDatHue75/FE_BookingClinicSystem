import React, { useState, useEffect } from "react";
import styles from "./CreateDoctor.module.css";
import { toast } from "react-toastify";
import doctorService from "../../../services/clinic/DoctorService";
import specialtyService from "../../../services/clinic/SpecialtyService";

const CreateDoctor = ({ onClose, onRefresh }) => {
  const defaultDoctor = {
    maTaiKhoan: "", 
    tenBacSi: "",
    gioiTinh: "true",
    ngaySinh: "",
    queQuan: "",
    soDienThoai: "",
    email: "",
    diaChi: "",
    maChuyenKhoa: "",
    bangCap: "",
    kinhNghiem: "",
    hoatDong: "",
    mieuTa1: "",
    mieuTa2: "",
    chucVu: "",
    hocHam: "",
    cccd: "",
    soGiayPhep: "",
    ngayCap: "", 
    noiCap: "",
    avtFile: null,         
    tepDinhKemFile: null,  
  };

  const [doctor, setDoctor] = useState(defaultDoctor);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      const maPK = localStorage.getItem("idPhongKham");
      if (maPK) {
        try {
          const res = await specialtyService.getAllSpecialties(maPK);
          setSpecialties(res || []);
        } catch (error) {
          console.error("Lỗi tải chuyên khoa:", error);
        }
      }
    };
    fetchSpecialties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e, fieldName) => {
    const file = e.target.files?.[0] || null;
    setDoctor((prev) => ({ ...prev, [fieldName]: file }));
  };

  const validate = () => {
    const newErr = {};
    if (!doctor.tenBacSi.trim()) newErr.tenBacSi = "Vui lòng nhập tên bác sĩ.";
    if (!doctor.ngaySinh) newErr.ngaySinh = "Chọn ngày sinh.";
    if (!doctor.email.trim()) newErr.email = "Vui lòng nhập email.";
    if (doctor.email && !/^\S+@\S+\.\S+$/.test(doctor.email)) newErr.email = "Email không hợp lệ.";
    if (!doctor.soDienThoai.trim()) newErr.soDienThoai = "Vui lòng nhập số điện thoại.";
    if (doctor.soDienThoai && !/^\d{9,11}$/.test(doctor.soDienThoai)) newErr.soDienThoai = "Số điện thoại 9–11 số.";
    if (!doctor.maChuyenKhoa) newErr.maChuyenKhoa = "Chọn chuyên khoa.";
    if (!doctor.cccd.trim()) newErr.cccd = "Vui lòng nhập số CCCD.";
    if (doctor.cccd && !/^\d{9,12}$/.test(doctor.cccd)) newErr.cccd = "CCCD 9–12 số.";
    return newErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    setSubmitting(true);
    try {
      const maPK = localStorage.getItem("idPhongKham");
      if (!maPK) throw new Error("Không tìm thấy mã phòng khám");

      const formData = new FormData();
      Object.keys(doctor).forEach((key) => {
        if (key !== 'avtFile' && key !== 'tepDinhKemFile') {
          if (key === 'ngayCap' && doctor[key]) {
            formData.append(key, `${doctor[key]}T00:00:00`);
          } else {
            formData.append(key, doctor[key]);
          }
        }
      });
      if (doctor.avtFile) formData.append("avt", doctor.avtFile);
      if (doctor.tepDinhKemFile) formData.append("tepDinhKem", doctor.tepDinhKemFile);

      await doctorService.createDoctor(maPK, formData);

      toast.success("Tạo bác sĩ thành công", { position: "top-center", autoClose: 2000 });
      
      // 💥 THÀNH CÔNG: Tải lại bảng bên ngoài và tự động đóng modal
      if (onRefresh) onRefresh();
      if (onClose) onClose();

    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi tạo bác sĩ.");
    } finally {
      setSubmitting(false);
    }
  };

  const Error = ({ msg }) => msg ? <span className={styles.errorMsg}>{msg}</span> : null;

  // Cấu trúc nền đen mờ
  const overlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
    display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
  };

  const modalContentStyle = {
    width: "100%", maxWidth: "1000px", maxHeight: "95vh", overflowY: "auto",
    backgroundColor: "#fff", borderRadius: "12px", position: "relative", padding: "0" 
  };

  return (
    <div style={overlayStyle}>
      <div style={modalContentStyle} className={styles.page}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Tạo mới bác sĩ</h1>
              <p className={styles.subtitle}>Nhập đầy đủ thông tin bên dưới. (*) là bắt buộc.</p>
            </div>
            {/* Đổi thành nút đóng cửa sổ */}
            <button
              type="button"
              className={styles.resetBtn}
              onClick={onClose}
              disabled={submitting}
            >
              ✕ Đóng
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* THÔNG TIN CƠ BẢN */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <label>Họ và tên <b>*</b></label>
                  <input name="tenBacSi" value={doctor.tenBacSi} onChange={handleChange} placeholder="VD: Nguyễn Văn A" />
                  <Error msg={errors.tenBacSi} />
                </div>
                <div className={styles.field}>
                  <label>Giới tính <b>*</b></label>
                  <select name="gioiTinh" value={doctor.gioiTinh} onChange={handleChange}>
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Ngày sinh <b>*</b></label>
                  <input type="date" name="ngaySinh" value={doctor.ngaySinh} onChange={handleChange} />
                  <Error msg={errors.ngaySinh} />
                </div>
                <div className={styles.field}>
                  <label>Quê quán</label>
                  <input name="queQuan" value={doctor.queQuan} onChange={handleChange} placeholder="VD: Hà Nội" />
                </div>
                <div className={styles.field}>
                  <label>Ảnh đại diện (Avatar)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'avtFile')} />
                </div>
              </div>
            </section>

            {/* LIÊN HỆ */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Liên hệ & Hành chính</h3>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <label>Email <b>*</b></label>
                  <input type="email" name="email" value={doctor.email} onChange={handleChange} placeholder="email@domain.com" />
                  <Error msg={errors.email} />
                </div>
                <div className={styles.field}>
                  <label>Số điện thoại <b>*</b></label>
                  <input name="soDienThoai" value={doctor.soDienThoai} onChange={handleChange} placeholder="09xxxxxxxx" />
                  <Error msg={errors.soDienThoai} />
                </div>
                <div className={styles.field}>
                  <label>Địa chỉ thường trú</label>
                  <input name="diaChi" value={doctor.diaChi} onChange={handleChange} placeholder="Số nhà, đường..." />
                </div>
              </div>
            </section>

            {/* CHUYÊN MÔN */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Công tác chuyên môn</h3>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <label>Chuyên khoa <b>*</b></label>
                  <select name="maChuyenKhoa" value={doctor.maChuyenKhoa} onChange={handleChange}>
                    <option value="">-- Chọn chuyên khoa --</option>
                    {specialties.map((sp) => (
                      <option key={sp.maChuyenKhoa} value={sp.maChuyenKhoa}>{sp.tenChuyenKhoa}</option>
                    ))}
                  </select>
                  <Error msg={errors.maChuyenKhoa} />
                </div>
                <div className={styles.field}>
                  <label>Chức vụ</label>
                  <select name="chucVu" value={doctor.chucVu} onChange={handleChange}>
                    <option value="">-- Chọn --</option>
                    <option value="Trưởng khoa">Trưởng khoa</option>
                    <option value="Phó khoa">Phó khoa</option>
                    <option value="Bác sĩ điều trị">Bác sĩ điều trị</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Học hàm/Học vị</label>
                  <select name="hocHam" value={doctor.hocHam} onChange={handleChange}>
                    <option value="">-- Chọn --</option>
                    <option value="Giáo sư">Giáo sư</option>
                    <option value="Phó giáo sư">Phó giáo sư</option>
                    <option value="Tiến sĩ">Tiến sĩ</option>
                    <option value="Thạc sĩ">Thạc sĩ</option>
                  </select>
                </div>
              </div>

              <div className={styles.grid2} style={{ marginTop: '15px' }}>
                <div className={styles.fieldWide}>
                  <label>Bằng cấp</label>
                  <textarea name="bangCap" rows={2} value={doctor.bangCap} onChange={handleChange} placeholder="VD: Tốt nghiệp loại giỏi ĐH Y Dược..." />
                </div>
                <div className={styles.fieldWide}>
                  <label>Kinh nghiệm</label>
                  <textarea name="kinhNghiem" rows={2} value={doctor.kinhNghiem} onChange={handleChange} placeholder="VD: 10 năm kinh nghiệm tại BV TW..." />
                </div>
                <div className={styles.fieldWide}>
                  <label>Hoạt động</label>
                  <textarea name="hoatDong" rows={2} value={doctor.hoatDong} onChange={handleChange} placeholder="Thành viên hiệp hội tim mạch..." />
                </div>
                <div className={styles.fieldWide}>
                  <label>Miêu tả 1</label>
                  <textarea name="mieuTa1" rows={2} value={doctor.mieuTa1} onChange={handleChange} placeholder="Thế mạnh chuyên môn..." />
                </div>
                <div className={styles.fieldWide}>
                  <label>Miêu tả 2</label>
                  <textarea name="mieuTa2" rows={2} value={doctor.mieuTa2} onChange={handleChange} placeholder="Thế mạnh chuyên môn..." />
                </div>
              </div>
            </section>

            {/* PHÁP LÝ */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Pháp lý & Giấy tờ</h3>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <label>Số CCCD <b>*</b></label>
                  <input name="cccd" value={doctor.cccd} onChange={handleChange} placeholder="12 chữ số" />
                  <Error msg={errors.cccd} />
                </div>
                <div className={styles.field}>
                  <label>Số giấy phép hành nghề</label>
                  <input name="soGiayPhep" value={doctor.soGiayPhep} onChange={handleChange} placeholder="VD: 001234/BYT-CCHN" />
                </div>
                <div className={styles.field}>
                  <label>Ngày cấp (CCCD/Giấy phép)</label>
                  <input type="date" name="ngayCap" value={doctor.ngayCap} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                  <label>Nơi cấp</label>
                  <input name="noiCap" value={doctor.noiCap} onChange={handleChange} placeholder="VD: Cục cảnh sát..." />
                </div>
                
                <div className={styles.fieldWide} style={{ gridColumn: 'span 2' }}>
                  <label>Tệp đính kèm chứng chỉ (Upload)</label>
                  <div className={styles.fileRow}>
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFile(e, 'tepDinhKemFile')} />
                    {doctor.tepDinhKemFile && (
                      <span className={styles.fileHint} style={{ marginLeft: '10px', color: '#3b82f6' }}>
                        Đã chọn: {doctor.tepDinhKemFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className={styles.footer}>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "Đang gửi..." : "Tạo bác sĩ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateDoctor;