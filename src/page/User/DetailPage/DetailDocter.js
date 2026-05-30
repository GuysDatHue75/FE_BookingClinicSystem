import Footer from "../../../components/FooterComponent/Footer";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import "./DetailDocter.css";
import { useEffect, useState } from "react";
import Button from "../../../components/ButtonComponent/Button";
import { Advise } from "../../../components/ButtonComponent/Button";
import { useParams } from "react-router-dom";
import apiClient from "../../../api/api";
import avtErr from "../../../assets/image/user-avt.png"
const DetailDocter = () => {
  const [docterDetail, setDocterDetail] = useState();
  const { id: idDocter } = useParams();

  useEffect(() => {
    const dataDoctor = async () => {
      const response = await apiClient.get(`/api/v1/doctors/${idDocter}`);
      setDocterDetail(response.data);

    };
    dataDoctor();
  }, [idDocter]);
  useEffect(() => {

    window.scrollTo({
      top: "true",
      behavior: "instant",
    });
  }, []);
  return (
    <>
      <Header />
      <div className="container-docterDetail">
        <p className="title-docterDetail">{docterDetail?.hocHam + " " + docterDetail?.taiKhoan.hoVaTen}</p>
        <div className="wrapper-backgroung-docterDetail">
          <img
            className="image-docterDetail"
            src={docterDetail?.avt || avtErr}
            alt={docterDetail?.taiKhoan.hoVaTen}
          />
          <div style={{ margin: "0" }}>
            <p style={{ fontWeight: "600" }}>
              Trưởng khoa {docterDetail?.specialty.tenChuyenKhoa}
            </p>
            <p style={{ fontWeight: "600" }}>Học hàm: {docterDetail?.hocHam}</p>
            <p style={{ marginTop: "15px" }}>
              {docterDetail?.mieuTa1}
            </p>

          </div>
        </div>

        <div>
          <p style={{ marginTop: "15px" }}>
            {docterDetail?.mieuTa2}

          </p>
          <p style={{ margin: "15px 0", fontWeight: "600" }}>
            Quá trình đào tạo
          </p>
          {docterDetail?.trainingProgram.length > 0 ?
            <ul>
              {docterDetail.trainingProgram?.map((train) => (
                <li style={{listStyle:"none"}} key={train.maDaoTao}>
                  <span style={{fontWeight:"bold"}}>{train.namBatDau} - {train.namKetThuc}</span>: {train.suKien} 
                </li>
              ))}
            </ul> : <p>...</p>}
          <p style={{ margin: "15px 0", fontWeight: "600" }}>
            Kinh nghiệm công tác
          </p>
          {docterDetail?.workEx.length > 0 ? 
            <ul>
              {docterDetail.workEx?.map((work) => (
                <li style={{listStyle:"none"}} key={work.maCongTac}>
                  <span style={{fontWeight:"bold"}}>{work.namBatDau} - {work.namKetThuc}</span>: {work.suKien}
                </li>
              ))}
            </ul> : <p>...</p>}
          <div className="booking-now-dl">
            <Button
              booking={true}
              title={true}
              path={`/${docterDetail?.phongKham.maPhongKham}/dat-lich-kham`}
              idDocter={docterDetail?.maBacSi}
            />
            <Advise path={"/tu-van"} />

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailDocter;
