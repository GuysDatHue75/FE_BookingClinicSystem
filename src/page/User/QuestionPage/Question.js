import React, { useMemo, useRef, useState, useEffect } from "react";
import "./Question.css";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import Footer from "../../../components/FooterComponent/Footer";
import TotalPage from "../../../components/TotalPagaComponent/TotalPage";
import { useNavigate, useParams } from "react-router-dom";
import { SelectCpm } from "../../../components/FIlterComponent/Filter";
import apiClient from "../../../api/api";
import avtDoctor from "../../../assets/image/TeamDocter.png"
const Question = () => {
  const { page: pageParam } = useParams();
  const inforDocterRef = useRef();
  const navigate = useNavigate();
  const city = localStorage.getItem('city');
  const idPatient = localStorage.getItem('idPatient')
  const [showAnswer, setShowAnswer] = useState(null);
  const [checkQuestion, setCheckQuestion] = useState(false);
  const [checkClinic, setCheckClinic] = useState(false);
  const [advisorys, setAdvisorys] = useState();
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCrrentPage] = useState(1);
  const [totalClinic, setTotalClinic] = useState();
  const [idClinic, setIdClinic] = useState();
  const [question, setQuestion] = useState();


  const QuestionRef = useRef();
  const ClinicRef = useRef();

  const handelShowAnswer = (index) => {
    if (showAnswer === index) {
      setShowAnswer(null);
    } else {
      setShowAnswer(index);
    }
  };
  const handlePage = async (p) => {
    if (p !== currentPage) {
      const response = await apiClient.get(`/api/v1/advisorys?page=${currentPage - 1}&size=5&city=${city}`);
      setAdvisorys(response.data.content);
      setCrrentPage(p);
      navigate(`/tu-van/page/${p}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  useEffect(() => {
    const p = parseInt(pageParam) || 1;
    setCrrentPage(p);
  }, [pageParam]);

  useEffect(() => {
    const fetchAdvisorys = async () => {
      const response = await apiClient.get(`/api/v1/advisorys?page=${currentPage - 1}&size=5&city=${city}`);
      const clinics = await apiClient.get(`/api/v1/clinics/city/${city}?page=0&size=1000`)
      
      setTotalClinic(clinics.data.content);
      const data = response.data;
      if (data.totalPages > 0 && currentPage > data.totalPages) {
        navigate(`/tu-van/page/${data.totalPages}`);
        return;
      }
      setAdvisorys(data.content);
      setTotalPages(data.totalPages);
    };

    fetchAdvisorys();
  }, [currentPage, navigate]);

  useEffect(() => {
    window.scrollTo({ top: true, behavior: "instant" });
  }, []);

  const handelSubmit = async (e) => {
    e.preventDefault();
    let isErr = false;

    if (!idClinic) {
      setCheckClinic(true);
      ClinicRef.current.style.border = "1px solid red";
      isErr = true;
    } else {
      setCheckClinic(false);
      ClinicRef.current.style.border = "1px solid #28c76f";
    }

    if (!QuestionRef.current.value.trim()) {
      setCheckQuestion(true);
      QuestionRef.current.style.border = "1px solid red";
      isErr = true;
    } else {
      setCheckQuestion(false);
      QuestionRef.current.style.border = "1px solid #28c76f";
    }

    if (isErr) return;

    try {
      const body = {
        patient: {
          maBenhNhan: idPatient,
        },
        clinic: {
          maPhongKham: idClinic,
        },
        cauHoi: QuestionRef.current.value.trim(),
      };

      const res = await apiClient.post(`/api/v1/advisory`, body);

      if (res) {
        alert("Gửi câu hỏi thành công.");
        setQuestion("");
        setIdClinic("");
        ClinicRef.current.style.border = "1px solid #e5e7eb";
        QuestionRef.current.style.border = "1px solid #e5e7eb";
      }
    } catch (error) {
      alert("Gửi thất bại!");
    }
  };
  useEffect(() => {
    window.scrollTo({
      top: "true",
      behavior: "instant",
    });
  }, []);
  return (
    <>
      <Header />
      <div className="container-question">
        {advisorys?.map((item, index) => (
          <div className="item-question" key={index}>
            <strong>
              <i class="fa-regular fa-comment-dots"></i> {item.patient.taiKhoan.hoVaTen}
            </strong>
            <p className="content-question">{item.cauHoi}</p>
            <button
              className="active-answer"
              onClick={() => handelShowAnswer(index)}
            >
              {showAnswer === index ? "Ẩn câu trả lời" : "Xem câu trả lời"}
            </button>
            {showAnswer === index && (
              <div className="answer-wrapper show">
                <div className="item-answer">
                  <img
                    className="img-answer"
                    alt={item.doctor?.taiKhoan.hoVaTen}
                    src={item.doctor?.taiKhoan.anhDaiDien || avtDoctor}
                  />
                  <div className="infor-docter-answer" ref={inforDocterRef}>
                    <p className="name-docter-answer">{item.doctor?.taiKhoan.hoVaTen}</p>
                    <p className="specityal-docter-answer">
                      {item.doctor?.specialty.tenChuyenKhoa}
                    </p>
                  </div>
                </div>
                <p className="docter-answer">{item.cauTraLoi}</p>
              </div>
            )}
          </div>
        ))}
        <div className="indexPage">
          <TotalPage
            totalPages={totalPages}
            currentPage={currentPage}
            handlePage={handlePage}
          />
        </div>
        <h2 className="title-question">Bạn muốn gửi câu hỏi để được tư vấn?</h2>
        <form
          className="wrappre-form-question"
          onSubmit={(e) => handelSubmit(e)}
        >
          <SelectCpm ClinicRef={ClinicRef} data={totalClinic} value={idClinic} onChange={(e) => { setIdClinic(e.target.value); ClinicRef.current.style.border = "1px solid #28c76f"; setCheckClinic(false); }} />
          {checkClinic && (
            <div className="messageClinic">Vui lòng chọn 1 phòng khám nếu có!</div>
          )}
          <textarea
            className="user-content-question"
            value={question}
            onChange={(e) => { setQuestion(e.target.value); QuestionRef.current.style.border = "1px solid #28c76f"; setCheckQuestion(false) }}
            ref={QuestionRef}
            placeholder="Nhập câu hỏi ở đây..."
          ></textarea>
          {checkQuestion && (
            <div className="messageQuestion">Vui lòng nhập câu hỏi!</div>
          )}
          <button className="active-answer">Gửi câu hỏi</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Question;
