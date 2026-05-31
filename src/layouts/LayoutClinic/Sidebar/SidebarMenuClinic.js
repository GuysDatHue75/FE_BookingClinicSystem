import React from "react";
import dashboardIcon from "../../../assets/svg/Dashboard.svg";
import phongkhamIcon from "../../../assets/svg/clinic.svg";
import quanlybacsiIcon from "../../../assets/svg/BacSi.svg";
import quanlylichlamviecIcon from "../../../assets/svg/Duyet.svg";
import quanlylichkhamIcon from "../../../assets/svg/LapLich.svg";
import quanLythongbaoIcon from "../../../assets/svg/notification.svg";
import quanlychuyenkhoaIcon from "../../../assets/svg/special.svg";
import quanLytintucIcon from "../../../assets/svg/news.svg";
import thongkeIcon from "../../../assets/svg/ThongKe.svg";
import profileIcon from "../../../assets/svg/profile.svg";

const menusItems = [
  // 💥 SỬA Ở ĐÂY: Truyền thẳng biến vào, KHÔNG DÙNG THẺ < ... /> NỮA!
  { icon: dashboardIcon, label: "Dashboard", path: "" },
  { icon: phongkhamIcon, label: "Thông tin phòng khám", path: "thong-tin-phong-kham" },
  { icon: quanlybacsiIcon, label: "Quản lý bác sĩ", path: "quan-ly-bac-si" },
  { icon: quanlychuyenkhoaIcon, label: "Quản lý chuyên khoa", path: "quan-ly-chuyen-khoa" },
  { icon: quanlylichlamviecIcon, label: "Quản lý Lịch làm việc", path: "lich-lam-viec" },
  // { icon: quanlylichkhamIcon, label: "Quản lý lịch khám", path: "quan-ly-lich-kham" },
  { icon: quanLythongbaoIcon, label: "Quản lý thông báo", path: "quan-ly-thong-bao" },
  { icon: quanLytintucIcon, label: "Quản lý tin tức", path: "quan-ly-tin-tuc" },
  {
    icon: thongkeIcon,
    label: "Thống kê - báo cáo",
    path: "thong-ke-bao-cao",
    subMenu: [
      { label: "Phòng khám", path: "phong-kham" },
      { label: "Người dùng toàn hệ thống", path: "nguoi-dung" },
      { label: "Doanh thu nền tảng", path: "doanh-thu" },
      { label: "Gói dịch vụ", path: "goi-dich-vu" },
      { label: "Chất lượng và uy tín của phòng khám", path: "chat-luong-uy-tin" },
    ],
  },

];

export default menusItems;