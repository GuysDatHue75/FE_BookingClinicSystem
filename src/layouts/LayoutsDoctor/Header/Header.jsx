
import React, { useContext, useEffect, useState } from "react";
import "./Header.css";

// 1. IMPORT CÁC FILE SVG VÀO ĐÂY:
import caiDatIcon from "../../../assets/svg/CaiDat.svg";
import thongBaoIcon from "../../../assets/svg/Chuong.svg";
import Avatar from "../../../assets/image/avt.jpg"; // Ảnh mặc định ban đầu
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../../api/api";
import HeaderNotification from "./HeaderNotification";
import { State } from "../../../state/context";

const Header = ({ urlImage }) => {
  const maBacSi = localStorage.getItem("idDoctor");
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  const idAccount = localStorage.getItem("idAccount");
  const { showNotification, setShowNotification, notificationIndex, setNotificationIndex,setAppointmentIndex } = useContext(State);
  useEffect(() => {
    const getCountNotification = async () => {
      const resPatientIndex = await apiClient.get(`/api/v1/confirm-appointment/pending`, {
        params: { maBacSi }
      });
      console.log(resPatientIndex.data);
      
     setAppointmentIndex(resPatientIndex.data.length);
      const resNotificationIndex = await apiClient.get(`/api/v1/c-notification?idAccount=${idAccount}&isRead=${false}`);
      setNotificationIndex(resNotificationIndex.data);
    }
    getCountNotification();
  }, [])
  const navigate = useNavigate(); //  tạo điều hướng

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



  const doctorName = localStorage.getItem("doctorName") || "Bác sĩ phụ trách";
  const doctorSpecialty = localStorage.getItem("doctorSpecialty") || "Chuyên khoa";
  // 1. Lấy tiêu đề  để mặc định là "Doctor Online Connect"
  // const currentTitle = "Doctor Online Connect";

  // ĐOẠN ĐỒNG BỘ AVATAR TỪ CONTEXT 
  const { image, setImage } = useContext(State);

  // Khi Header vừa mount, nạp ảnh từ localStorage vào Context nếu có 
  useEffect(() => {
    const savedAvatar = localStorage.getItem("doctorAvatar");
    if (savedAvatar) {
      setImage(savedAvatar);
    }
  }, [location, setImage]);

  // Thứ tự ưu tiên: Ảnh mới vừa cập nhật -> Ảnh đã lưu trong máy -> Ảnh mặc định dự phòng (Avatar)
  const displayAvatar = image || localStorage.getItem("doctorAvatar") || Avatar;

  return (
    <header className="header-container">
      <div className="header-left">
      </div>

      <div className="header-right">
        <div className="notification-wrapper">
          <button
            className="header-btn notification-btn"
            title="Thông báo"
            onClick={() => setShowNotification(!showNotification)}
          >
            <img
              src={thongBaoIcon}
              alt="Thông báo"
              className="header-icon-img"
            />

            {notificationIndex > 0 && (
              <span className="noti-badge-header">
                {notificationIndex}
              </span>
            )}
          </button>

          {showNotification && (
            <HeaderNotification
              onClose={() => setShowNotification(false)}
            />
          )}
        </div>

        {/* 3. Avatar Mini */}
        <div className="avatar-wrapper">
          <div
            className="header-avatar-box"
            onClick={() => setShowDropdown(!showDropdown)}
          >
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
                <strong>Bs: {doctorName}</strong>
                <span>Chuyên khoa : {doctorSpecialty}</span>
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