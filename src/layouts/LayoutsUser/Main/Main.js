import { useContext, useEffect, useRef } from "react";
import styles from "./Main.module.css";
import { State } from "../../../state/context";
import Loading from "../../../components/LoadingComponent/Loading";
import { ViewMore } from "../../../components/ButtonComponent/Button";
import CarDocter from "../../../components/DocterComponent/CarDocter";
import HealthNews from "../../../components/HealthNewsComponent/HealthNews";
import Specialty from "../../../components/SpecialtyComponent/Specialty";
import Footer from "../../../components/FooterComponent/Footer";
import ScrollReveal from "scrollreveal";
import ClinicCpn from "../../../components/ClinicComponent/ClinicCpn";
import apiClient from "../../../api/api";
import { useState } from "react";
import { Fence } from "lucide-react";
import FeedBack from "../../../components/FeddBackComponent/FeedBack";
const Main = () => {
  const { loading, resetPage } = useContext(State);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newsList, setNewsList] = useState([]);
  
  const city = localStorage.getItem("city") || '""';
  const animation = localStorage.getItem("animation");
  const clinicRef = useRef();
  useEffect(() => {
    const rs = ScrollReveal({
      origin: "top",
      distance: "300px",
      duration: "2500",
    });
    !animation && rs.reveal(clinicRef?.current, { origin: "left" });
    const dataClinic = async () => {
      const response = await apiClient.get(`api/v1/clinics-top-8?city=${city}`);
      const responseDoctors = await apiClient.get(`/api/v1/doctors-top-8?city=${city}`);
      const resNews = await apiClient.get(`/api/v1/news?tp=${localStorage.getItem("city")}&page=0&size=10`);
      console.log(responseDoctors.data);
      
      setNewsList(resNews.data.content);
      setClinics(response.data)
      setDoctors(responseDoctors.data)
    }
    localStorage.setItem('animation', true);
    dataClinic();
    return () => rs.destroy();
  }, []);
  return (
    <div className={styles.mainWrapper}>
      {loading && (
        <div className="loading-main">
          <Loading />
        </div>
      )}
      {resetPage && (
        <div className={styles.test}>
          <div className={styles.containerMain} ref={clinicRef}>
            <h2 className="title-clinic">Phòng khám</h2>
            <div className={styles.wrapperClinic}>
              {clinics.length > 0 ? <> {
                clinics.map((item, index) => (
                  <ClinicCpn item={item} index={index} key={index} />
                ))
              } </> : <p style={{ fontWeight: "500", fontSize: "18px" }}>Hiện chưa có phòng khám nào.</p>}

            </div>
            {clinics.length > 0 ? <div className={styles.ViewMoreDocter}>
              <ViewMore path={"/phong-kham"} />
            </div> : ""}
            <h2 className="title-docter">Bác sĩ</h2>
            <div className={styles.wrapperDocter}>
              {doctors.length > 0 ? <>{
                doctors
                  .map((item) =>
                    <CarDocter
                      key={item.maBacSi}
                      doctor={item}
                      item={item}
                    />

                  )}</> : <p style={{ fontWeight: "500", fontSize: "18px", margin: '0' }}>Hiện chưa có bác sĩ nào.</p>}

            </div>
            {doctors.length > 0 ? <div className={styles.ViewMoreDocter}>
              <ViewMore path={"/bac-si"} />
            </div> : ""}
            <Specialty />
            <HealthNews dataNews={newsList}/>
            {newsList.length >= 0 ? <div style={{ textAlign: "center", marginTop:"30px" }}>
              <ViewMore path={"/tin-tuc"} />
            </div> : ""}
          </div>
        </div>
      )}
      {!loading && <Footer />}
    </div>
  );
};

export default Main;
