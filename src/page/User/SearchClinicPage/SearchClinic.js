import "./SearchClinic.css";
import {useEffect, useState, useMemo } from "react";
import ClinicCpn from "../../../components/ClinicComponent/ClinicCpn";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import Footer from "../../../components/FooterComponent/Footer";
import apiClient from "../../../api/api";
import TotalPage from "../../../components/TotalPagaComponent/TotalPage";
import { useNavigate, useParams } from "react-router-dom";
const SearchClinic = () => {
  const totalItemInPage = 10;
  const [dataShow, setDataShow] = useState([]);
  const IDSP = localStorage.getItem('IDSP');
  const city = localStorage.getItem('city');
  const NAMESP = localStorage.getItem( 'NAMESP');
  const navigate = useNavigate();
  const [totalPage, setTotalPage] = useState();
  const { page: pageParam } = useParams();
  const currentPage = useMemo(() => parseInt(pageParam) || 1, [pageParam]);
  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(`/api/v1/specialty/clinics?tp=${city}&id=${IDSP}&page=${currentPage - 1}&size=${totalItemInPage}`)
      const total = response.data.totalPages;
      if(total > 0 && currentPage > total){
        navigate(`/tim-kiem-chuyen-khoa/page/${total}`)
      }
      setDataShow(response.data.content);
      setTotalPage(response.data.totalPages)
    }
    getData();
  }, [currentPage,city,NAMESP]);
  const handlePage = (p) => {
    navigate(`/tim-kiem-chuyen-khoa/page/${p}`);
  }
  return (
    <>
      <Header />
      <div className="container-searchSpecialty">
        {dataShow.length != 0 ? (
          <p className="done-searchSpecialty">
            Đã tìm kiếm các phòng khám có chuyên khoa{" "}
            <strong>{NAMESP}</strong>
          </p>
        ) : (
          " "
        )}
        <div className="wrapper-clinic">
          {dataShow.length != 0 ? (
            dataShow.map((item, index) => (
              <ClinicCpn key={index} item={item} index={index} />
            ))
          ) : (
            <p className="message-searchSpecialty">
              Hiện tại không có phòng khám nào có chuyên khoa{" "}
              <strong>{NAMESP}</strong>.
            </p>
          )}
        </div>
        <TotalPage
          totalPages={totalPage}
          currentPage={currentPage}
          handlePage={handlePage}
        />
      </div>
      {dataShow.length != 0 && <Footer />}
    </>
  );
};

export default SearchClinic;
