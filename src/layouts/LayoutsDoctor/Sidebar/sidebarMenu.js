import React from "react";
import dashboardIcon from "../../../assets/svg/Dashboard.svg";
import quanLyBenhNhanIcon from "../../../assets/svg/QuanLy.svg";
import duyetLichKhamIcon from "../../../assets/svg/Duyet.svg";
import quanLyLichKhamIcon from "../../../assets/svg/LapLich.svg";
import donThuocIcon from "../../../assets/svg/DonThuoc.svg";
import tuVanIcon from "../../../assets/svg/TuVan.svg";
import khamOnlineIcon from "../../../assets/svg/KhamOnline.svg";
import bacSiIcon from "../../../assets/svg/BacSi.svg";

const menuItems = [
  // 💥 SỬA Ở ĐÂY: Truyền thẳng biến vào, KHÔNG DÙNG THẺ < ... /> NỮA!
  //{ icon: dashboardIcon, label: "Dashboard", path: "" },
  { icon: quanLyBenhNhanIcon, label: "Quản lý bệnh nhân", path: "/doctor/Patients" },
  { icon: duyetLichKhamIcon, label: "Duyệt lịch khám", path: "/doctor/View" },
  { icon: quanLyLichKhamIcon, label: "Quản lý lịch khám", path: "/doctor/schedule" },
  { icon: donThuocIcon, label: "Đơn thuốc", path: "/doctor/Invoice" },
  //{ icon: dienDanIcon, label: "Diễn đàn", path: "/doctor/OnlineConsult" },
  //{ icon: tinTucIcon, label: "Tin tức - Thông báo", path: "" },
  { icon: tuVanIcon, label: "Trả lời hỏi đáp", path: "/doctor/QnA" },
  { icon: khamOnlineIcon, label: "Khám online", path: "/doctor/OnlineConsult" },

  {
    icon: bacSiIcon,
    label: "Bác sĩ",
    path: "/doctor/Profile",
    subMenu: [{ label: "Sửa Profile", path: "/doctor/Profile/EditProfile" }],
  },


];

export default menuItems;