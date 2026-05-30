import React, { useEffect, useState } from "react";
import styles from "./DoctorView.module.css";
import doctorService from "../../../services/clinic/DoctorService";
import { toast } from "react-toastify";

export default function DoctorView({ maBacSi, onClose, onDelete }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = "http://localhost:8080";

  const getMediaUrl = (media) => {
    if (!media) return null;
    if (typeof media === "string") {
      return media.startsWith("http") ? media : `${IMAGE_BASE_URL}${media}`;
    }
    return null;
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await doctorService.getDoctorDetail(maBacSi);
        setDoctor(res);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết bác sĩ:", error);
        toast.error("Không tìm thấy thông tin bác sĩ");
      } finally {
        setLoading(false);
      }
    };
    
    if (maBacSi) fetchDetail();
  }, [maBacSi]);

  // Cấu trúc nền đen mờ đè lên toàn màn hình
  const overlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
    display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
  };

  const modalContentStyle = {
    width: "100%", maxWidth: "1000px", maxHeight: "90vh", overflowY: "auto",
    backgroundColor: "#fff", borderRadius: "16px", position: "relative",
    padding: "30px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" // Padding sẽ được xử lý bởi class page bên trong
  };

  if (loading) return <div style={overlayStyle}><div style={{...modalContentStyle, padding: '40px', textAlign: 'center'}}>Đang tải thông tin...</div></div>;
  if (!doctor) return <div style={overlayStyle}><div style={{...modalContentStyle, padding: '40px', textAlign: 'center'}}>Không có dữ liệu. <button onClick={onClose}>Đóng</button></div></div>;

  const avtUrl = getMediaUrl(doctor.avt);
  const tepDinhKemUrl = getMediaUrl(doctor.tepDinhKem);

  return (
    <div style={overlayStyle}>
      <div style={modalContentStyle} className={styles.page}>
        <div className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", justifyContent: 'space-between', width: '100%' }}>
            <div>
              <h1 className={styles.title}>Hồ sơ bác sĩ</h1>
              <p className={styles.subtitle}>Mã BS: {doctor.maBacSi} - Tài khoản: {doctor.maTaiKhoan || "Chưa cấp"}</p>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={onClose} 
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ccc", cursor: "pointer", background: "#fff", fontWeight: "bold" }}
              >
                ✕ Đóng
              </button>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {/* HỒ SƠ CƠ BẢN */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Hồ sơ cơ bản</h2>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ width: '120px', height: '150px', backgroundColor: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                {avtUrl ? (
                   <img src={avtUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                   <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Trống</div>
                )}
              </div>
              <div className={styles.formGrid} style={{ flexGrow: 1 }}>
                <Field label="Tên bác sĩ"><DisplayText value={doctor.tenBacSi} /></Field>
                <Field label="Giới tính"><DisplayText value={doctor.gioiTinh ? "Nam" : "Nữ"} /></Field>
                <Field label="Ngày sinh"><DisplayText value={doctor.ngaySinh} /></Field>
                <Field label="Quê quán"><DisplayText value={doctor.queQuan} /></Field>
              </div>
            </div>
          </section>

          {/* LIÊN HỆ & HÀNH CHÍNH */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Liên hệ & Hành chính</h2>
            <div className={styles.formGrid}>
              <Field label="Email"><DisplayText value={doctor.email} /></Field>
              <Field label="Số điện thoại"><DisplayText value={doctor.soDienThoai} /></Field>
              <Field label="Địa chỉ"><DisplayText value={doctor.diaChi} /></Field>
              <Field label="Số CCCD"><DisplayText value={doctor.cccd} /></Field>
            </div>
          </section>

          {/* CÔNG TÁC CHUYÊN MÔN */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Công tác chuyên môn</h2>
            <div className={styles.formGrid}>
              <Field label="Chuyên khoa"><DisplayText value={doctor.tenChuyenKhoa} /></Field>
              <Field label="Chức vụ"><DisplayText value={doctor.chucVu} /></Field>
              <Field label="Học hàm/Học vị"><DisplayText value={doctor.hocHam} /></Field>
              <Field label="Bằng cấp" col={2}><DisplayText value={doctor.bangCap} /></Field>
              <Field label="Kinh nghiệm" col={2}><DisplayText value={doctor.kinhNghiem} /></Field>
              <Field label="Hoạt động" col={2}><DisplayText value={doctor.hoatDong} /></Field>
              <Field label="Miêu tả 1" col={2}><DisplayText value={doctor.mieuTa1} /></Field>
              <Field label="Miêu tả 2" col={2}><DisplayText value={doctor.mieuTa2} /></Field>
            </div>
          </section>

          {/* PHÁP LÝ & GIẤY PHÉP */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Pháp lý & Giấy phép</h2>
            <div className={styles.formGrid}>
              <Field label="Số giấy phép hành nghề"><DisplayText value={doctor.soGiayPhep} /></Field>
              <Field label="Ngày cấp"><DisplayText value={doctor.ngayCap ? doctor.ngayCap.split('T')[0] : ""} /></Field>
              <Field label="Nơi cấp"><DisplayText value={doctor.noiCap} /></Field>
              <Field label="Tệp đính kèm (Giấy phép)" col={2}>
                {tepDinhKemUrl ? (
                  <a href={tepDinhKemUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: '500' }}>Xem tệp đính kèm</a>
                ) : (<span style={{ color: "#94a3b8" }}>Chưa có tệp</span>)}
              </Field>
            </div>
          </section>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button 
            onClick={onDelete} 
            style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#ef4444", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
          >
            <i className="fa-solid fa-trash"></i> Xóa bác sĩ
          </button>
        </div>   
      </div>
    </div>
  );
}

function Field({ label, children, col = 1 }) {
  return (
    <div className={`${styles.field} ${col === 2 ? styles.col2 : ""}`}>
      <label className={styles.label} style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>{label}</label>
      {children}
    </div>
  );
}

function DisplayText({ value }) {
  return (
    <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '42px', color: '#0f172a' }}>
      {value || <span style={{color: '#94a3b8', fontStyle: 'italic'}}>Chưa cập nhật</span>}
    </div>
  );
}