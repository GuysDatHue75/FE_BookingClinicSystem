import React, { useContext, useState, useEffect } from "react";
import "./Header.css";

// 1. IMPORT CÁC FILE SVG VÀO ĐÂY:
import caiDatIcon from "../../../assets/svg/CaiDat.svg";
import thongBaoIcon from "../../../assets/svg/Chuong.svg";
import Avatar from "../../../assets/image/avt.jpg"; // Ảnh mặc định ban đầu
import { useLocation, useNavigate } from "react-router-dom";
import { State } from "../../../state/context";

const Header = ({ urlImage, notificationCount = 3 }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const navigate = useNavigate(); // Tạo điều hướng

  // --- HÀM XỬ LÝ CHỨC NĂNG ---
  const handleGoToChangePassword = () => {
    setShowDropdown(false); // Đóng menu lại cho chuyên nghiệp
    navigate("/doctor/doi-mat-khau");
  };

  const handleLogout = () => {
    setShowDropdown(false);
    // Xóa dữ liệu avatar khỏi bộ nhớ khi đăng xuất để user sau vào không bị trùng
    localStorage.removeItem("doctorAvatar");
    alert("Đang đăng xuất...");
    navigate("/login");
  };




  // 1. Lấy tiêu đề  để mặc định là "Doctor Online Connect"
  const currentTitle = "Doctor Online Connect";

  // ĐOẠN ĐỒNG BỘ AVATAR TỪ CONTEXT 
  const { image, setImage } = useContext(State);

  // Khi Header vừa mount, nạp ảnh từ localStorage vào Context nếu có (giúp F5 không mất ảnh)
  useEffect(() => {
    const savedAvatar = localStorage.getItem("doctorAvatar");
    if (savedAvatar && !image) {
      setImage(savedAvatar);
    }
  }, []);

  // Thứ tự ưu tiên: Ảnh mới vừa cập nhật -> Ảnh đã lưu trong máy -> Ảnh mặc định dự phòng (Avatar)
  const displayAvatar = image || localStorage.getItem("doctorAvatar") || Avatar;

  return (
    <header className="header-container">
      <div className="header-left">
        <h2 className="page-title">{currentTitle}</h2>
      </div>

      <div className="header-right">
        {/* 1. Icon Cài đặt */}
        <button className="header-btn" title="Cài đặt">
          <img src={caiDatIcon} alt="Cài đặt" className="header-icon-img" />
        </button>

        {/* 2. Icon Thông báo */}
        <button className="header-btn notification-btn" title="Thông báo">
          <img src={thongBaoIcon} alt="Thông báo" className="header-icon-img" />
          {notificationCount > 0 && (
            <span className="noti-badge-header">{notificationCount}</span>
          )}
        </button>

        {/* 3. Avatar Mini */}
        <div className="avatar-wrapper">
          <div
            className="header-avatar-box"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {/* ĐÃ SỬA: Thay đổi từ src={Avatar} thành src={displayAvatar} */}
            <img
              src={displayAvatar}
              alt="Avatar Bác sĩ"
              className="avatar-img-round"
            />
          </div>

          {/* Menu thả xuống */}
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