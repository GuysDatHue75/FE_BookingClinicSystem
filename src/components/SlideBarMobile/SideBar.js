import { Link } from "react-router-dom";
import IsloginSucessfull from "../../components/IsLoginComponent/IsLoginSucessfull";
import "./SideBar.css";
const SideBar = ({ mobileRef }) => {
  const optionMenuMobile = [
    { name: "Trang chủ", path: "/trang-chu", id: 1 },
    { name: "Bác sĩ", path: "/bac-si", id: 2 },
    { name: "Phòng khám", path: "/phong-kham", id: 3 },
    { name: "Tư vấn", path: "/tu-van", id: 4 },
    { name: "Blog", path: "/blog", id: 5 },
    { name: "Chính sách bảo mật", path: "/chinh-sach-bao-mat", id: 6 },
    { name: "Kênh phòng khám", path: "/confirm", id: 0 },
    { name: "Hồ sơ của tôi", path: "/trang-ca-nhan", id: 7 },
    { name: "Lịch sử khám bệnh", path: "/lich-su-kham-benh", id: 8 },
    { name: "Lịch khám của tôi", path: "/xem-lich-kham", id: 9 },
    { name: "Khám lâm sàn - online", path: "/kham-lam-san", id: 10 },
    { name: "Đăng nhập", path: "/login", id: 11 },
    { name: "Đăng xuất ", path: "/login", id: 12 },
    { name: "Cài đặt", path: "/confirm", id: 13 },
  ];
  return (
    <div className="container-sidebarMobile" ref={mobileRef}>
      <div className="list-option-mobile">
        <img
          style={{ marginLeft: "20px" }}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&s"
          alt="logo"
          className="image-islogin"
        />
        {optionMenuMobile.slice(0, 11)?.map((item) => (
          <Link key={item.id} to={item.path}>
            {item.name}
          </Link>
        ))}
        <div className="list-option-mobile-setting">
          {optionMenuMobile.slice(11, 14).map((item) => (
            <Link to={item.path}>{item.name}</Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
