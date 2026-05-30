import { useContext, useMemo, useState, useEffect } from "react";
import "./Docter.css";
import Header from "../../../../layouts/LayoutsUser/Header/Header";
import Footer from "../../../../components/FooterComponent/Footer";
import { DocterAll } from "../../../../components/DocterComponent/CarDocter";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../components/LoadingComponent/Loading";
import Filter from "../../../../components/FIlterComponent/Filter";
import { FilterAll } from "../../../../components/FIlterComponent/Filter";
import { State } from "../../../../state/context";
import TotalPage from "../../../../components/TotalPagaComponent/TotalPage";
import apiClient from "../../../../api/api";
const Docter = () => {
  const navigate = useNavigate();
  const { page: pageParam } = useParams();
  const totalItemInPage = 10;
  const city = localStorage.getItem('city');

  const [totalPage, setTotalPage] = useState();
  const [hocHamFilter, setHocHamFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const { loading, setLoading } = useContext(State);
  const [doctorsToShow, setDoctorsToShow] = useState([]);
  const hocHamData = [
    { id: 1, name: "Học hàm", value: "" },
    { id: 2, name: "Giáo sư", value: "Giáo sư" },
    { id: 3, name: "Phó giáo sư", value: "Phó giáo sư" },
    { id: 4, name: "Tiến sĩ", value: "Tiến sĩ" },
    { id: 5, name: "Bác sĩ", value: "Bác sĩ" },
  ];
  const currentPage = useMemo(() => parseInt(pageParam) || 1, [pageParam]);

  const fetchDoctorsData = async () => {
    setLoading(true);
    try {
      let url = "";
      if (hocHamFilter || specialtyFilter) {
        url = `/api/v1/doctorAll/doctors?hh=${hocHamFilter}&ck=${specialtyFilter}&tp=${city}&page=${currentPage - 1}&size=${totalItemInPage}`;
      } else {
        url = `/api/v1/doctors/city/${city}?page=${currentPage - 1}&size=${totalItemInPage}`;
      }

      const res = await apiClient.get(url);
      const total = res.data.totalPages;
      if (total > 0 && currentPage > total) {
        navigate(`/bac-si/page/${total}`);
        return; 
      }
      setDoctorsToShow(res.data.content);
      setTotalPage(res.data.totalPages);

    } catch (error) {
      setDoctorsToShow([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, city, hocHamFilter, specialtyFilter]);

  const handlePage = (p) => {
    navigate(`/bac-si/page/${p}`);
  };

  const handleFilterDocterSpecialty = (value) => {
    setSpecialtyFilter(value);
    navigate("/bac-si/page/1");
  };

  const handleFilterDocterHocHam = (value) => {
    setHocHamFilter(value);
    navigate("/bac-si/page/1");
  };

  const specialtyData = useMemo(() => {
    if (!doctorsToShow) return [];
    const map = new Map();
    doctorsToShow.forEach((d) => {
      const id = d.specialty?.maChuyenKhoa;
      const name = d.specialty?.tenChuyenKhoa;
      if (id && name && !map.has(id)) {
        map.set(id, { idspecital: id, name: name });
      }
    });
    return Array.from(map.values());
  }, [doctorsToShow]);
  return (
    <>
      <Header />
      <div className="container-docterAll">
        <div className="wrapper-filter-docter">
          <Filter
            handleFilterDocterSpecialty={handleFilterDocterSpecialty}
            specialtyData={specialtyData}
          />
          <FilterAll
            handleFilterDocterHocHam={handleFilterDocterHocHam}
            data={hocHamData}
          />
        </div>

        {loading && <Loading />}

        {!loading && (
          <>
            <div className="wrapper-docterAll">
              {doctorsToShow.length > 0 ? (
                doctorsToShow.map((doctor) => (
                  <DocterAll key={doctor.maBacSi} doctor={doctor} />
                ))
              ) : (
                <p>Không tìm thấy bác sĩ phù hợp.</p>
              )}
            </div>
            <div className="indexPage">
              <TotalPage
                totalPages={totalPage}
                currentPage={currentPage}
                handlePage={handlePage}
              />
            </div>
          </>
        )}
      </div>
      {!loading && <Footer />}
    </>
  );
};
export default Docter;
