import { useContext, useEffect, useMemo, useState } from "react";
import "./Clinic.css";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import ClinicCpn from "../../../components/ClinicComponent/ClinicCpn";
import Filter from "../../../components/FIlterComponent/Filter";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/LoadingComponent/Loading";
import { State } from "../../../state/context";
import Footer from "../../../components/FooterComponent/Footer";
import TotalPage from "../../../components/TotalPagaComponent/TotalPage";
import apiClient from "../../../api/api";
const Clinic = () => {
  const navigate = useNavigate();
  const totalItemInPage = 10;
  const { page: pageParam } = useParams();
  const [clinicToShow, setClinicToShow] = useState([]);
  const [idSpecialtyFilter, setIdSpecialtyFilter] = useState("");
  const [totalPage, setTotalPage] = useState();

  const city = localStorage.getItem('city');
  const { setLoading, loading } = useContext(State);
  const currentPage = useMemo(() =>
    parseInt(pageParam) || 1,
    [pageParam])
  const fetchClinicsData = async () => {
    setLoading(true);
    try {
      let url = "";
      if (idSpecialtyFilter) {
        url = `api/v1/specialty/clinics?tp=${city}&id=${idSpecialtyFilter}&page=${currentPage - 1}&size=${totalItemInPage}`
      } else {
        url = `/api/v1/clinics/city/${city}?page=${currentPage - 1}&size=${totalItemInPage}`
      }

      const response = await apiClient.get(url)
      const total = response.data.totalPages;

      if (total > 0 && currentPage > total) {
        navigate(`/phong-kham/page/${total}`);
        return;
      }
      setClinicToShow(response.data.content);
      setTotalPage(total);
    } catch (error) {
      setClinicToShow([]);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    fetchClinicsData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, city, idSpecialtyFilter]);

  const handleFilterDocterSpecialty = (value) => {
    setIdSpecialtyFilter(value);
    navigate("/phong-kham/page/1");
  };

  const handlePage = (p) => {
    navigate(`/phong-kham/page/${p}`)
  }

  const specialtyData = useMemo(() => {
    if (!clinicToShow || clinicToShow.length === 0) return [];

    const map = new Map();

    clinicToShow.forEach((clinic) => {
      if (Array.isArray(clinic.specicaltys)) {
        clinic.specicaltys.forEach((s) => {
          const id = s.maChuyenKhoa;
          const name = s.tenChuyenKhoa;
          if (id && name && !map.has(id)) {
            map.set(id, {
              idspecital: id,
              name: name
            });
          }
        });
      }
    });

    return Array.from(map.values());
  }, [clinicToShow]);

  return (
    <>
      <Header />
      <div className="container-clinic">
        <Filter
          specialtyData={specialtyData}
          handleFilterDocterSpecialty={handleFilterDocterSpecialty}
        />
        {!loading && (
          <div className="wrapper-clinic">
            {clinicToShow.map((item, index) => (
              <ClinicCpn item={item} index={index} />
            ))}
          </div>
        )}
        {loading && <Loading />}
        <div className="indexPage">
          <TotalPage
            totalPages={totalPage}
            currentPage={currentPage}
            handlePage={handlePage}
          />
        </div>
      </div>
      {!loading && <Footer />}
    </>
  );
};

export default Clinic;
