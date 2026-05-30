import React, { useState } from "react";
import "./Header.css";

// 1. IMPORT CÁC FILE SVG VÀO ĐÂY:
import caiDatIcon from "../../../assets/svg/CaiDat.svg";
import thongBaoIcon from "../../../assets/svg/Chuong.svg";
import Avatar from "../../../assets/image/avt.jpg";
import { useLocation, useNavigate } from "react-router-dom";


const Header = ({ urlImage, notificationCount = 3 }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const navigate = useNavigate(); //  tạo điều hướng

  // --- HÀM XỬ LÝ CHỨC NĂNG ---

  const handleGoToChangePassword = () => {
    setShowDropdown(false); // Đóng menu lại cho chuyên nghiệp
    navigate("/doctor/doi-mat-khau");
  };

  const handleLogout = () => {
    setShowDropdown(false);
    // 1. Xóa Token/Session ở đây (sau này code)
    // localStorage.removeItem("token"); 

    alert("Đang đăng xuất..."); // Thông báo tạm thời
    navigate("/login"); // 
  };
  // 1. Tạo một cái "Từ điển" để tra cứu tiêu đề dựa trên path
  const pageTitles = {
    "/doctor": "Bảng điều khiển",
    "/doctor/Patients": "Quản lý bệnh nhân",
    "/doctor/settings": "Cài đặt hệ thống",
    "/doctor/profile": "Hồ sơ cá nhân",

  };

  // 2. Lấy tiêu đề tương ứng, nếu không thấy thì để mặc định là "Doctor Online"
  const currentTitle = pageTitles[location.pathname] || "Doctor Online Connect";

  return (
    <header className="header-container">
      <div className="header-left">
        <h2 className="page-title">{currentTitle}</h2>
      </div>

      <div className="header-right">

        {/* 1. Icon Cài đặt: Dùng thẻ img gọi thẳng biến caiDatIcon */}
        <button className="header-btn" title="Cài đặt">
          <img src={caiDatIcon} alt="Cài đặt" className="header-icon-img" />
        </button>

        {/* 2. Icon Thông báo: Gọi thẳng biến thongBaoIcon */}
        <button className="header-btn notification-btn" title="Thông báo">
          <img src={thongBaoIcon} alt="Thông báo" className="header-icon-img" />

          {/* Chấm đỏ đếm thông báo */}
          {notificationCount > 0 && (
            <span className="noti-badge-header">{notificationCount}</span>
          )}
        </button>

        {/* 3. Avatar Mini */}
        <div className="avatar-wrapper"> {/* Phải dùng class avatar-wrapper để menu thả xuống đúng vị trí */}
          <div
            className="header-avatar-box"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {/* Cho ảnh chui vào trong box này thì nó mới nằm đè lên nền xám được */}
            <img
              src={Avatar}
              alt="Avatar Bác sĩ"
              className="avatar-img-round"
            />
          </div>

          {/* Menu thả xuống phải nằm trong wrapper để position: absolute hoạt động chuẩn */}
          {showDropdown && (
            <div className="avatar-dropdown">
              <div className="dropdown-info">
                <strong>Bác sĩ Nguyễn Văn A</strong>
                <span>BS. Chuyên khoa I</span>
              </div>
              <hr />
              <button className="dropdown-item" onClick={handleGoToChangePassword}>
                <i className="fa-solid fa-key"></i> Đổi mật khẩu
              </button>

              <button className="dropdown-item logout" onClick={handleLogout}>
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