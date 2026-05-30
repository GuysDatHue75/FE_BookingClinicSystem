import { useEffect, useState } from "react";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import { useParams } from "react-router-dom";
import "./Detail.css";
import Footer from "../../../components/FooterComponent/Footer";
import { DocterAll } from "../../../components/DocterComponent/CarDocter";
import FeedBack from "../../../components/FeddBackComponent/FeedBack";
import Adchiements from "../../../components/AdchievementPage/Adchiements";
import DetaiClinicCpn from "../../../components/DetailClinicComponent/DetaiClinicCpn";
import apiClient from "../../../api/api";
import DocterSlider from "./DocterSlider";
const Detail = () => {
  const { id: idDetail } = useParams();
  const [clinicDetailShow, setClinicDetailShow] = useState({});
  const [dataDocterDetail, setDataDocterDetail] = useState([]);
  const [dataAdchievement, setDataAdchievement] = useState([]);
  const [feedBackList, setFeedBackList] = useState([]);


  useEffect(() => {
    const getData = async () => {
      const dataClincs = await apiClient.get(`/api/v1/clinics/${idDetail}`);
      const dataDoctors = await apiClient.get(`/api/v1/clinic/doctors?id=${idDetail}`);
      const dataFeedbacks = await apiClient.get(`/api/v1/clinic/feedbacks?id=${idDetail}`);
      const dataNews = await apiClient.get(`/api/v1/clinic/t-3news?id=${idDetail}`);
      setClinicDetailShow(dataClincs.data);
      setDataDocterDetail(dataDoctors.data);
      setFeedBackList(dataFeedbacks.data);
      
      setDataAdchievement(dataNews.data);
    }
    getData();
  }, [idDetail]);

  // useEffect(() => {
  //   setDataAdchievement(() =>
  //     adchievementsData.filter((adchiement) => adchiement.clinic === nameClinic)
  //   );
  // }, [slugDetail, nameClinic]);

  useEffect(() => {
    window.scrollTo({
      top: "true",
      behavior: "instant",
    });
  }, []);
  return (
    <div>
      <Header />
      <div className="container-detail">
        <h2 className="title-detail">Chi tiết phòng khám</h2>
        <DetaiClinicCpn clinicDetailShow={clinicDetailShow} />
        <h2 className="title-detail">Danh sách bác sĩ</h2>
        <div className="wrapper-docter-detail">
          {dataDocterDetail.length > 0  ? 
          <>
            <DocterSlider dataDocterDetail={dataDocterDetail} />
          </> : <p>Phòng khám chưa đăng ký bác sĩ</p>}
          
        </div>
        <div>
          <h2 className="title-detail">Tin tức nổi bât</h2>
          <Adchiements dataAdchievement={dataAdchievement} />
        </div>
        <FeedBack dataFeedBack={feedBackList} />
      </div>
      <Footer />
    </div>
  );
};
export default Detail;
