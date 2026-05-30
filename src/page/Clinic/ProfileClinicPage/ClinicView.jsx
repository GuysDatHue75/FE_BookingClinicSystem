import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ClinicView.module.css";
import { State } from "../../../state/context";
import clinicsService from "../../../services/clinic/ClinicsService";
import UpdateClinic from "../UpdateClinicPage/UpdateClinic";

const ClinicView = () => {
  const { profileClinic, setProfileClinic } = useContext(State);
  const isProfileEmpty = !profileClinic || Object.keys(profileClinic).length === 0;
  const [loading, setLoading] = useState(!profileClinic);
  const [isEditing, setIsEditing] = useState(false);
  const IMAGE_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const clinicStorage = localStorage.getItem("profileClinic");
    if(clinicStorage) {
      try{
        const clinicData = JSON.parse(clinicStorage);
        setProfileClinic(clinicData);
      }catch(e){
        console.error("Lỗi parse profileClinic từ localStorage:", e);
      }
    }
    const fetchData = async () => {
      try {
        const maPK = localStorage.getItem("idPhongKham");
        console.log("Mã phòng khám đang fetch:", maPK);
        if (!maPK) {
          console.error("Không tìm thấy mã phòng khám");
          return;
        }
          const res = await clinicsService.getDetail(maPK);
          setProfileClinic(res);
          localStorage.setItem("profileClinic", JSON.stringify(res));
      } catch (err) {
        console.error("Lỗi lấy thông tin phòng khám:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

  }, []);

  // Hàm xử lý URL an toàn chống crash
  const getMediaUrl = (media) => {
    if (!media) return null;
    
    // Trường hợp 1: Dữ liệu từ DB trả về là chuỗi String
    if (typeof media === 'string') {
      return media.startsWith("http") ? media : `${IMAGE_BASE_URL}${media}`;
    }
    
    // Trường hợp 2: Dữ liệu là File Object do người dùng vừa upload
    if (media instanceof File) {
      return URL.createObjectURL(media);
    }
    
    return null;
  };

  // Khởi tạo biến url an toàn
  const giayPhepUrl = getMediaUrl(profileClinic?.giayPhep);
  const anhUrl = getMediaUrl(profileClinic?.anhPhongKham);

  if (loading || !profileClinic) return <div className={styles.page}>Đang tải...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Thông tin phòng khám</h1>
        <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
          Chỉnh sửa
        </button>
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Thông tin tài khoản</h2>
        <div className={styles.grid}>
          <Field label="Mã tài khoản" value={profileClinic.maTaiKhoan} />
          <Field label="Tên đăng nhập" value={profileClinic.soDt} />
          <Field label="Mật khẩu" value={profileClinic.matKhau} />
          <Field label="Mã gói đăng ký" value={profileClinic.maGoi}/>
          <Field label="Tên gói đăng ký" value={profileClinic.tenGoi} />
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Thông tin chung</h2>
        <div className={styles.grid}>
          <Field label="Mã PK" value={profileClinic.maPhongKham} />
          <Field label="Tên phòng khám" value={profileClinic.tenPhongKham} wide />
          <Field label="Loại hình" value={profileClinic.loaiHinhPhongKham} />
          <Field label="Ngày thành lập" value={formatDate(profileClinic.ngayThanhLap)} />
          <Field label="Ngày đăng ký" value={formatDate(profileClinic.ngayDangKy)} />
          <Field label="Email" value={profileClinic.email} />
          <Field label="Số điện thoại" value={profileClinic.soDienThoai} />
          <Field label="Số lượng bác sĩ" value={profileClinic.soLuongBacSi} />
          <Field label="Địa chỉ" value={profileClinic.diaChi} wide />
          <Field label="Tỉnh/Thành phố" value={profileClinic.tinhThanhPho} />
          <Field label="Giờ làm việc" value={`${profileClinic.gioBatDauLamViec || ""} - ${profileClinic.gioKetThucLamViec || ""}`} wide />
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Pháp lý & Đại diện</h2>
        <div className={styles.grid}>
          <Field label="Người đại diện" value={profileClinic.nguoiDaiDien} />
          <Field label="SĐT đại diện" value={profileClinic.soDienThoaiNguoiDaiDien} />
          <Field label="Giấy phép" value={profileClinic.giayPhep ? (
                <a href={giayPhepUrl} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', textDecoration: 'underline'}}>
                  Xem chứng từ đính kèm
                </a>
              ) : "Chưa cập nhật"
            } 
          />
          <Field label="Ngày cấp" value={formatDate(profileClinic.ngayCap)} />
          <Field label="Nơi cấp" value={profileClinic.noiCap} />
          <Field label="Trạng thái" value={profileClinic.trangThai} />
          <Field label="Số sao" value={profileClinic.soSao} />
          <Field label="Hình ảnh phòng khám" value={<img src={anhUrl} alt="Hình phòng khám" className={styles.mediaImage} />} wide />
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Mô tả</h2>
        <p className={styles.description}>{profileClinic.moTa || "Chưa có mô tả"}</p>
      </section>
      {isEditing && <UpdateClinic onClose={() => setIsEditing(false)} />}
    </div>
  );
};

const Field = ({ label, value, wide = false }) => (
  <div className={`${styles.field} ${wide ? styles.wide : ""}`}>
    <div className={styles.fieldLabel}>{label}</div>
    <div className={styles.fieldValue}>{value || "—"}</div>
  </div>
);

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

export default ClinicView;