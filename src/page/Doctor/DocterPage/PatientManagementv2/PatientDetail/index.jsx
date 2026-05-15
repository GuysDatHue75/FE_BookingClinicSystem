import React, { useEffect, useState } from "react";
import styles from "../PatientManagement.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PatientDetail = () => {
  const { maBenhNhan } = useParams(); // Lấy mã BN từ URL
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  //nút back
  const handleGoBack = () => {
    navigate(-1);
  }

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Giả sử sếp đã có API: get-by-id/{id}
        const response = await axios.get(`http://localhost:8080/api/v1/patient/get-detail/${maBenhNhan}`);
        setPatient(response.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [maBenhNhan]);

  return (
    <div className={styles.detailContainer}>
      <button className={styles.backButton} onClick={handleGoBack}>
        <i className="fa-solid fa-arrow-left"></i> Trở lại Danh sách bệnh nhân
      </button>
    <div className="styles.gridLayout"></div>

    </div>


  )



}

export default PatientDetail;
