import { useEffect, useState } from "react";
import "./CarDocter.css";
import Button from "../../../src/components/ButtonComponent/Button";
import avtErr from "../../assets/image/user-avt.png";
const CarDocter = ({ doctor, item }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="container-docterCar">
      <div
        className={`flip-card ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img
              className="image-docter"
              src={doctor.avt || doctor?.taiKhoan?.anhDaiDien || avtErr}
              alt={doctor.taiKhoan?.hoVaTen}
            />
            <p className="name-docter">{doctor.taiKhoan?.hoVaTen}</p>
            <p className="specialty-docter">Trưởng khoa {doctor.specialty?.tenChuyenKhoa}</p>
            <p className="description-clinic">{doctor.mieuTa1}</p>

            <div className="booking-docter">
              <Button
                booking={true}
                title={true}
                path={`/${item.phongKham.maPhongKham}/dat-lich-kham`}
                nameDocter={doctor.name}
                idDocter={item.maBacSi}
              />
              <Button
                booking={true}
                path={`/xem-chi-tiet-bac-si/${doctor.maBacSi}`}
                idDocter={doctor.idDocter}
              />
            </div>
          </div>

          <div className="flip-card-back">
            {doctor.mieuTa1}
          </div>
        </div>
      </div>
    </div>
  );
};
export const DocterAll = ({ doctor }) => {
  return (
    <>
      <div className="item-docterAll">
        <img src={doctor.avt || avtErr} alt={doctor.taiKhoan.hoVaTen} className="image-docter" />
        <div>
          <p className="name-docter">
            {doctor.hocHam} - {doctor.taiKhoan.hoVaTen}
          </p>
          <p className="specialty-docter specialty-docterAll">
            Trưởng khoa {doctor.specialty.tenChuyenKhoa}
          </p>
          <p className="description-clinic description-clinic-forDocterAll">
            {doctor.mieuTa1}
          </p>
          <div className="booking-docter">
            <Button
              booking={true}
              title={true}
              path={`/${doctor.phongKham.maPhongKham}/dat-lich-kham`}
              idDocter={doctor.maBacSi}
              docter={doctor}
            />
            <Button
              booking={true}
              path={`/xem-chi-tiet-bac-si/${doctor.maBacSi}`}
              idDocter={doctor.idDocter}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CarDocter;
