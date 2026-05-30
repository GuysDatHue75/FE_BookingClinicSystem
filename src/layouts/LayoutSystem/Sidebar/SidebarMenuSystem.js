import React from "react";
import dashboardIcon from "../../../assets/svg/Dashboard.svg";
import duyetphongkhamIcon from "../../../assets/svg/clinic.svg";
import quanlyphongkhamIcon from "../../../assets/svg/managementclinic.svg";
import quanLythongbaoIcon from "../../../assets/svg/notification.svg";
import quanlygoidangkyIcon from "../../../assets/svg/package.svg";
import thongkeIcon from "../../../assets/svg/ThongKe.svg";
import profileIcon from "../../../assets/svg/profile.svg";

const menuItems = [
  // 💥 SỬA Ở ĐÂY: Truyền thẳng biến vào, KHÔNG DÙNG THẺ < ... /> NỮA!
  { icon: dashboardIcon, label: "Dashboard", path: "" },
  { icon: duyetphongkhamIcon, label: "Duyệt phòng khám", path: "duyet-phong-kham" },
  { icon: quanlyphongkhamIcon, label: "Quản lý phòng khám", path: "quan-ly-phong-kham" },
  { icon: quanLythongbaoIcon, label: "Quản lý thông báo", path: "quan-ly-thong-bao" },
  { icon: quanlygoidangkyIcon, label: "Quản lý gói đăng ký", path: "quan-ly-goi-dang-ky" },
  {
    icon: thongkeIcon,
    label: "Thống kê - báo cáo",
    path: "thong-ke-bao-cao/",
    subMenu: [
      { label: "Phòng khám", path: "phong-kham" },
      { label: "Người dùng toàn hệ thống", path: "nguoi-dung" },
      { label: "Doanh thu nền tảng", path: "doanh-thu" },
      { label: "Gói dịch vụ", path: "goi-dich-vu" },
      { label: "Chất lượng và uy tín của phòng khám", path: "chat-luong-uy-tin" },
    ],
  },
  { icon: profileIcon, label: "Profile", path: "thong-tin" },

];

export default menuItems;