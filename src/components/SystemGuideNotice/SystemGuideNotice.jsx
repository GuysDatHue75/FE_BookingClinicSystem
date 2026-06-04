import { useNavigate } from "react-router-dom";
import "./SystemGuideNotice.css";
import apiClient from "../../api/api";

const SystemGuideNotice = ({ onClose }) => {
    const navigate = useNavigate();
    const idAccount = localStorage.getItem("idAccount");

    const handleReadGuide = async () => {
        try {
            await apiClient.put(
                `/api/v1/convert-status-login/${idAccount}`
            );
            localStorage.setItem("isOneLogin", "0");

            if (onClose) {
                onClose();
            }

            navigate("/huong-dan-he-thong");
        } catch (err) {
            console.error(err);
        }
    };

    const handleLater = async () => {
        try {
            await apiClient.put(
                `/api/v1/convert-status-login/${idAccount}`
            );
            localStorage.setItem("isOneLogin", "0");

            if (onClose) {
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="guide-overlay">
            <div className="guide-card">
                <h2>Hướng dẫn sử dụng hệ thống</h2>

                <p>
                    Để sử dụng 1 cách thông minh và chính xác các chức năng như
                    đặt lịch khám, tư vấn trực tuyến với AI và quản lý hồ sơ
                    bệnh án, vui lòng đọc hướng dẫn và các quy tắc sử dụng hệ
                    thống.
                </p>

                <ul>
                    <li>Quy trình đặt lịch và hủy lịch khám.</li>
                    <li>Nguyên tắc sử dụng trợ lý AI y tế.</li>
                    <li>Quy định tư vấn trực tuyến với bác sĩ.</li>
                    <li>Chính sách bảo mật thông tin bệnh nhân.</li>
                    <li>Cách viết các câu lệnh để AI tìm kiếm phòng khám & bác sĩ.</li>
                </ul>

                <div className="guide-actions">
                    <button
                        className="guide-btn-primary"
                        onClick={handleReadGuide}
                    >
                        Đọc hướng dẫn
                    </button>

                    <button
                        className="guide-btn-secondary"
                        onClick={handleLater}
                    >
                        Để sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemGuideNotice;