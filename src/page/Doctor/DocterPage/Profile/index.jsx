import React, { useState, useEffect, useContext } from "react";
import styles from "./Profile.module.css";
import apiClient from "../../../../api/api";
import { State } from "../../../../state/context";

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { image, setImage } = useContext(State);

  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0 });

    // Lấy mã bác sĩ từ localStorage, mặc định theo dữ liệu test của bạn
    const maBacSi = localStorage.getItem("idDoctor") || localStorage.getItem("maBacSi") || "BS001";

    const fetchDoctorProfile = async () => {
      try {
        const response = await apiClient.get(`/api/v1/doctor/profile/${maBacSi}`);
        setDoctor(response.data);

        if (response.data.avt && response.data.avt.trim() !== "" && response.data.avt !== "null") {
          let validAvt = response.data.avt;
          if (!validAvt.startsWith("http") && !validAvt.startsWith("blob") && !validAvt.startsWith("data:image/")) {
            validAvt = `http://localhost:8080/uploads/${validAvt}`;
          }
          // Chỉ cập nhật nếu Context hiện tại đang trống
          if (!image) {
            setImage(validAvt);
            localStorage.setItem("doctorAvatar", validAvt);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin hồ sơ bác sĩ:", error);
        alert("Không thể tải thông tin hồ sơ bác sĩ!");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  if (loading) return <div className={styles.loadingState}>Đang tải thông tin hồ sơ...</div>;
  if (!doctor) return <div className={styles.errorState}>Không tìm thấy thông tin bác sĩ!</div>;

  // Xử lý avatar: nếu null thì dùng ảnh mặc định từ context


  const avatarUrl = doctor.avt
    ? (doctor.avt.startsWith("http") || doctor.avt.startsWith("blob") || doctor.avt.startsWith("data:image/"))
      ? doctor.avt
      : `http://localhost:8080/uploads/${doctor.avt}`
    : (image || localStorage.getItem("doctorAvatar"));

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className={styles.profileWrapper}>

      {/* --- CỘT TRÁI: SIDEBAR THÔNG TIN CÁ NHÂN --- */}
      <div className={styles.sidebar}>
        <div className={styles.avatarCard}>
          <div className={styles.avatarContainer}>
            <img src={avatarUrl} alt="Avatar Bác sĩ" className={styles.avatarImage} onError={(e) => {
              e.target.onerror = null; // Ngăn vòng lặp vô hạn nếu ảnh fallback cũng lỗi
              e.target.src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop"; // Đường dẫn ảnh mặc định hoặc avatar placeholder sạch sẽ
            }} />
          </div>
          <h2 className={styles.doctorName}>{doctor.hocHam ? `${doctor.hocHam} ` : ''}{doctor.tenBacSi}</h2>
          <p className={styles.doctorTitle}>{doctor.chucVu || "Bác sĩ điều trị"}</p>
          <div className={styles.badgeGroup}>
            <span className={styles.badge}><i className="fa-solid fa-stethoscope"></i> {doctor.maChuyenKhoa}</span>
            <span className={styles.badge}><i className="fa-solid fa-hospital-user"></i> {doctor.maPhongKham}</span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Thông Tin Cá Nhân</h3>
          <ul className={styles.infoList}>
            <li>
              <div className={styles.infoIcon}><i className="fa-solid fa-venus-mars"></i></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Giới tính</span>
                <span className={styles.infoValue}>{doctor.gioiTinh ? "Nam" : "Nữ"}</span>
              </div>
            </li>
            <li>
              <div className={styles.infoIcon}><i className="fa-solid fa-calendar-days"></i></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Ngày sinh</span>
                <span className={styles.infoValue}>{formatDate(doctor.ngaySinh)}</span>
              </div>
            </li>
            <li>
              <div className={styles.infoIcon}><i className="fa-regular fa-id-card"></i></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>CCCD / Hộ chiếu</span>
                <span className={styles.infoValue}>{doctor.cccd || "Chưa cập nhật"}</span>
              </div>
            </li>
            <li>
              <div className={styles.infoIcon}><i className="fa-solid fa-map-location-dot"></i></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Quê quán</span>
                <span className={styles.infoValue}>{doctor.queQuan || "Chưa cập nhật"}</span>
              </div>
            </li>
          </ul>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Thông Tin Liên Hệ</h3>
          <ul className={styles.infoList}>
            <li>
              <div className={styles.infoIcon}><i className="fa-solid fa-phone"></i></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Số điện thoại</span>
                <span className={styles.infoValue}>{doctor.soDienThoai || "Chưa cập nhật"}</span>
              </div>
            </li>
            <li>
              <div className={styles.infoIcon}><i className="fa-solid fa-envelope"></i></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{doctor.email || "Chưa cập nhật"}</span>
              </div>
            </li>
            <li>
              <div className={styles.infoIcon}><i className="fa-solid fa-house-chimney"></i></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Địa chỉ hiện tại</span>
                <span className={styles.infoValue}>{doctor.diaChi || "Chưa cập nhật"}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* --- CỘT PHẢI: NỘI DUNG CHUYÊN MÔN --- */}
      <div className={styles.mainContent}>

        {/* Giới thiệu (mieuTa1) */}
        <div className={styles.contentCard}>
          <h3 className={styles.sectionTitle}><i className="fa-solid fa-user-doctor"></i> Giới Thiệu Chung</h3>
          <p className={styles.paragraphText}>
            {doctor.mieuTa1 || "Chưa có thông tin giới thiệu."}
          </p>
        </div>

        {/* Chuyên môn sâu (mieuTa2) & Hoạt động */}
        <div className={styles.contentCard}>
          <h3 className={styles.sectionTitle}><i className="fa-solid fa-heart-pulse"></i> Chuyên Môn & Hoạt Động</h3>

          <div className={styles.highlightBox}>
            <strong><i className="fa-solid fa-star"></i> Thế mạnh chuyên môn: </strong>
            <p className={styles.paragraphText} style={{ marginTop: '8px' }}>{doctor.mieuTa2 || "Chưa cập nhật chuyên môn sâu."}</p>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h4>Kinh nghiệm công tác</h4>
                <p>{doctor.kinhNghiem || "Chưa cập nhật kinh nghiệm."}</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h4>Lĩnh vực khám chữa bệnh</h4>
                <p>{doctor.hoatDong || "Chưa cập nhật hoạt động."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Học vấn & Bằng cấp */}
        <div className={styles.contentCard}>
          <h3 className={styles.sectionTitle}><i className="fa-solid fa-graduation-cap"></i> Trình Độ Học Vấn</h3>
          <div className={styles.grid2Col}>
            <div className={styles.dataGroup}>
              <label>Học hàm / Học vị</label>
              <div>{doctor.hocHam || "Chưa cập nhật"}</div>
            </div>
            <div className={styles.dataGroup}>
              <label>Bằng cấp chuyên môn</label>
              <div style={{ color: '#0056b3', fontWeight: '600' }}>{doctor.bangCap || "Chưa cập nhật"}</div>
            </div>
          </div>
        </div>

        {/* Thông tin pháp lý & Hồ sơ đính kèm */}
        <div className={styles.contentCard}>
          <h3 className={styles.sectionTitle}><i className="fa-solid fa-scale-balanced"></i> Thông Tin Pháp Lý & Chứng Chỉ</h3>

          <div className={styles.legalInfoBox}>
            <div className={styles.legalRow}>
              <span className={styles.legalLabel}>Số giấy phép hành nghề:</span>
              <span className={styles.legalValueHighlight}>{doctor.soGiayPhep || "Chưa cập nhật"}</span>
            </div>
            <div className={styles.legalRow}>
              <span className={styles.legalLabel}>Ngày cấp:</span>
              <span className={styles.legalValue}>{formatDate(doctor.ngayCap)}</span>
            </div>
            <div className={styles.legalRow}>
              <span className={styles.legalLabel}>Nơi cấp:</span>
              <span className={styles.legalValue}>{doctor.noiCap || "Chưa cập nhật"}</span>
            </div>
          </div>

          {/* Xử lý hiển thị file đính kèm */}
          {doctor.tepDinhKem && (
            <div className={styles.attachmentBox}>
              <div className={styles.attachmentIcon}>
                <i className="fa-regular fa-file-pdf"></i>
              </div>
              <div className={styles.attachmentInfo}>
                <h4>Hồ sơ đính kèm (Giấy phép / CCCD)</h4>
                <a
                  href={doctor.tepDinhKem.startsWith("http") ? doctor.tepDinhKem : `http://localhost:8080${doctor.tepDinhKem}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.downloadLink}
                >
                  Xem tài liệu <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;