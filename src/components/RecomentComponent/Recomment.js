import styles from "./Recomment.module.css";
import { useContext, useEffect, useState } from "react";
import { State } from "../../state/context";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/api";
import avtErr from "../../assets/image/user-avt.png";
import Loading from "../LoadingComponent/Loading";
const Recomment = () => {
  const { valueText, setValueText } = useContext(State);
  const navigate = useNavigate();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const city = localStorage.getItem("city") || "";

  useEffect(() => {
    if (!valueText.trim()) {
      setClinics([]);
      setDoctors([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingSearch(true);
        const clinicRes = await apiClient.get(
          `/api/v1/clinics?name=${valueText}&tp=${city}`
        );

        const doctorRes = await apiClient.get(
          `/api/v1/doctors?name=${valueText}&tp=${city}`
        );

        setClinics(clinicRes.data || []);
        setDoctors(doctorRes.data || []);
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoadingSearch(false);
      }
    };
    const delay = setTimeout(() => {
      fetchData();
    }, 400);
    return () => clearTimeout(delay);
  }, [valueText]);

  const handelSearch = (id) => {
    setValueText("");
    navigate(`/chi-tiet-phong-kham/${id}`);
  };

  const handelSearchDoctor = (idDoctor) => {
    setValueText("");
    localStorage.setItem("idDocter", idDoctor);
    navigate(`/xem-chi-tiet-bac-si/${idDoctor}`);
  };

  return (
    <div className={styles.contentRecomment}>
      {clinics.length > 0 && (
        <>
          <p className={styles.titleRecomment}>Phòng khám</p>
          {clinics.map((clinic) => (
            <div
              className={styles.wrapperContentRecomment}
              key={clinic.maPhongKham}
              onClick={() => handelSearch(clinic.maPhongKham)}
            >
              <img className={styles.imgaeRecomment} src={clinic.anhPhongKham || avtErr} alt="" />
              <div>
                <p className={styles.name}>{clinic.tenPhongKham}</p>
                <p className={styles.sub}>{clinic.tinhThanhPho}</p>
              </div>
            </div>
           
          ))}
        </>
      )}

      {doctors.length > 0 && (
        <>
          <p className={styles.titleRecomment}>Bác sĩ</p>
          {doctors.map((doctor) => (
            <div
              className={styles.wrapperContentRecomment}
              key={doctor.maBacSi}
              onClick={() =>
                handelSearchDoctor(doctor.maBacSi)
              }
            >
              <img className={styles.imgaeRecomment} src={doctor.avt || avtErr} alt="" />
              <div>
                <p className={styles.name}>{doctor.taiKhoan.hoVaTen}</p>
                <p className={styles.sub}>
                  {doctor.specialty?.tenChuyenKhoa}
                </p>
              </div>
            </div>
          ))}
        </>
      )}

      {clinics.length === 0 && doctors.length === 0 && (
        <p className={styles.noResult}>Không tìm thấy kết quả.</p>
      )}
    </div>
  );
};

export default Recomment;