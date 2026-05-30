import { useNavigate } from "react-router-dom";
import apiClient from "../../api/api";
import { State } from "../../state/context";
import styles from "./FeedbackCreate.module.css";
import { useContext, useState } from "react";

const FeedbackCreate = ({ clinicId, doctorId, calendaId, onFeedbackSuccess }) => {
    const [clinicRating, setClinicRating] = useState(0);
    const [doctorRating, setDoctorRating] = useState(0);
    const [comment, setComment] = useState("");
    const { feedBack, setFeedBack } = useContext(State);

    const handleSubmit = async () => {
        if (clinicRating === 0 || doctorRating === 0 || comment === "") {
            alert("Vui lòng đánh giá đầy đủ!");
            return;
        }
        const data = {
            benhNhan: {
                maBenhNhan: localStorage.getItem("idPatient")
            },
            maLichKham: calendaId,
            maPhongKham: clinicId,
            maBacSi: doctorId,
            soSaoPhongKham: clinicRating,
            soSaoBacSi: doctorRating,
            noiDung: comment
        }
        const response = await apiClient.post("/api/v1/feedback", data);

        if (response.status === 200 || response.status === 201) {
            alert("Gửi đánh giá thành công!");
            onFeedbackSuccess(calendaId);
            setClinicRating(0);
            setDoctorRating(0);
            setComment("");
            setFeedBack(false);
        } else {
            alert("Gửi đánh giá thất bại!");
        }

    };

    const renderStars = (rating, setRating) => {
        return (
            <div className={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`${styles.star} ${star <= rating ? styles.active : ""
                            }`}
                        onClick={() => setRating(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className={styles.overlay} onClick={() => setFeedBack(false)}>
            </div>
            <div className={styles.container}>
                <h2>Đánh giá dịch vụ</h2>
                <div className={styles.section}>
                    <h3>Đánh giá phòng khám</h3>
                    {renderStars(clinicRating, setClinicRating)}

                    <textarea
                        placeholder="Nhập nhận xét về phòng khám..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                <div className={styles.section}>
                    <h3>Đánh giá bác sĩ</h3>
                    {renderStars(doctorRating, setDoctorRating)}
                </div>

                <button onClick={handleSubmit} className={styles.submitBtn}>
                    Gửi đánh giá
                </button>
            </div>
        </>
    );
};

export default FeedbackCreate;