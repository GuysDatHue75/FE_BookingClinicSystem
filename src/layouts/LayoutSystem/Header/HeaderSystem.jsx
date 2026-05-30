import React, { useState } from "react";
import styles from "./HeaderSystem.module.css";

// 1. IMPORT CÁC FILE SVG VÀO ĐÂY:
import caiDatIcon from "../../../assets/svg/CaiDat.svg";
import thongBaoIcon from "../../../assets/svg/Chuong.svg";
import Avatar from "../../../assets/image/avt.jpg";
import menuIcon from "../../../assets/svg/menu.svg";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ urlImage, notificationCount = 3, user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const navigate = useNavigate(); // Khởi tạo điều hướng

  // --- HÀM XỬ LÝ CHỨC NĂNG ---
  const handleGoToChangePassword = () => {
    setShowDropdown(false); // Đóng menu lại cho chuyên nghiệp
    navigate("/admin/doi-mat-khau");
  };

  const handleLogout = () => {
    setShowDropdown(false);
    // Xóa dữ liệu phiên đăng nhập
    localStorage.clear();
    navigate("/login");
  };

  // 1. Tạo một cái "Từ điển" để tra cứu tiêu đề dựa trên path
  const pageTitles = {
    "/admin": "Thống kê & Báo cáo hệ thống",
    "/admin/duyet-phong-kham": "Phê duyệt tài khoản phòng khám",
    "/admin/viet-thong-bao": "Quản lý & Soạn thảo thông báo",
    "/admin/doi-mat-khau": "Thay đổi mật khẩu tài khoản",
  };

  // 2. Lấy tiêu đề tương ứng, nếu không thấy thì để mặc định
  const currentTitle = pageTitles[location.pathname] || "Doctor Online Connect";

  return (
    /* FIX: Module hóa toàn bộ className bằng cú pháp tương thích dấu gạch ngang */
    <header className={styles['header-container']}>
      <div className={styles['header-left']}>
        <button className={styles['header-btn']} title="Menu">
          <img src={menuIcon} alt="Menu" className={styles['header-icon-img']} />
        </button>
        {/* Tiêu đề trang động nếu bạn có dùng hiển thị trên giao diện */}
        {/* <h1 className={styles['page-title']}>{currentTitle}</h1> */}
      </div>

      <div className={styles['header-right']}>
        {/* 1. Icon Cài đặt */}
        <button className={styles['header-btn']} title="Cài đặt">
          <img src={caiDatIcon} alt="Cài đặt" className={styles['header-icon-img']} />
        </button>

        {/* 2. Icon Thông báo: Kết hợp class thường và class notification bằng Template String */}
        <button 
          className={`${styles['header-btn']} ${styles['notification-btn']}`} 
          title="Thông báo"
        >
          <img src={thongBaoIcon} alt="Thông báo" className={styles['header-icon-img']} />

          {/* Chấm đỏ đếm thông báo */}
          {notificationCount > 0 && (
            <span className={styles['noti-badge-header']}>{notificationCount}</span>
          )}
        </button>

        {/* 3. Avatar Mini */}
        <div className={styles['avatar-wrapper']}>
          <div
            className={styles['header-avatar-box']}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src={urlImage || Avatar} // Ưu tiên dùng avatar động từ API, nếu không có thì dùng ảnh mặc định
              alt="Avatar"
              className={styles['avatar-img-round']}
            />
          </div>

          {/* Menu thả xuống */}
          {showDropdown && (
            <div className={styles['avatar-dropdown']}>
              <div className={styles['dropdown-info']}>
                <strong>{user?.fullName || "Quản trị viên"}</strong>
                <span>{user?.account?.vaiTro || "Admin"}</span>
              </div>
              <hr />
              <button className={styles['dropdown-item']} onClick={handleGoToChangePassword}>
                <i className="fa-solid fa-key"></i> Đổi mật khẩu
              </button>

              {/* Class logout đặc biệt kết hợp class dropdown-item chung */}
              <button 
                className={`${styles['dropdown-item']} ${styles.logout}`} 
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;