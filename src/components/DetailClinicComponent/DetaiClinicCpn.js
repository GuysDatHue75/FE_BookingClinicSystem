import { Advise, BookingHome } from "../ButtonComponent/Button";
import avtErr from "../../assets/image/Clinic.png";
import "./DetailClinicCpn.css";
const DetaiClinicCpn = ({ clinicDetailShow }) => {
  return (
    <div className="wrapper-detail">
      <img src={clinicDetailShow?.anhPhongKham || avtErr} className="image-detail" />
      <div className="infor-detail">
        <p className="name-detail">{clinicDetailShow.tenPhongKham}</p>
        <p>
          <i class="fa-solid fa-location-dot"></i> {clinicDetailShow.diaChi}
        </p>
        <p>
          <i class="fa-regular fa-clock"></i> Giờ mở cửa:{" "}
          {clinicDetailShow.gioBatDauLamViec + "h" + " - " + clinicDetailShow.gioKetThucLamViec + "h"}
        </p>

        <p>{clinicDetailShow.moTa}</p>
        <p>Ngày thành lập: {clinicDetailShow.ngayThanhLap}</p>
        <p>Liên hệ tư vấn: {clinicDetailShow.soDienThoai}</p>
        <p>
          Các loại chuyên khoa:{" "}
          {clinicDetailShow.specicaltys?.map((i, index) =>
            index != clinicDetailShow.specicaltys.length - 1 ? i.tenChuyenKhoa + "," : i.tenChuyenKhoa + "."
          )}
          <p>Chủ cơ sở: {clinicDetailShow.nguoiDaiDien}</p>
          <div>
            <Advise path={"/tu-van"} />
          </div>
        </p>
      </div>
    </div>
  );
};

export default DetaiClinicCpn;
