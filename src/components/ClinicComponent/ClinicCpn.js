import "./ClinicCpn.css";
import { useNavigate } from "react-router-dom";
import clinicErr from "../../assets/image/clinicErr.png"
const ClinicCpn = ({ item, index }) => {
  const navigate = useNavigate();
  const handelClickDetailClinic = (idClinic) => {
    navigate(`/chi-tiet-phong-kham/${idClinic}`);
  };
  return (
    <div
      className="item-clinic"
      key={index}
      onClick={() => handelClickDetailClinic(item.maPhongKham)}
    >
      <img className="image-clinic" src={item.anhPhongKham || clinicErr} alt={item.tenPhongKham} />
      <div>
        <p className="name-clinic">{item.tenPhongKham}</p>
        <p className="location-clinic">
          <i class="fa-solid fa-location-dot"></i>
          {item.diaChi}
        </p>
        <p className="openClock-clinic">
          <i class="fa-regular fa-clock"></i>
          {item.gioBatDauLamViec + "h" + " - " + item.gioKetThucLamViec + "h"}
        </p>
        <p className="star-clinic">
          {item.soSao ? [...Array(parseInt(item.soSao))].map((_, i) => (
            <i key={i} className="fa-solid fa-star" style={{ color: "gold", marginBottom:"5px"}}></i>
          )) : ""}
        </p>
        <span className="status-clinic">
          <span
            className={
              item.trangThai == "Hoạt động"
                ? "color-status-open-clinic"
                : "color-status-close-clinic"
            }
          ></span>
          <span style={{ padding: "0 10px" }}>{item.trangThai == "Hoạt động" ? "Đang hoạt động" : "Đã đóng cửa"}</span>
        </span>
      </div>
    </div>
  );
};

export default ClinicCpn;
