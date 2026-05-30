import "./NotFound.css";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  const handelRoutingNotfound = () => {
    const role = localStorage.getItem("role");
    if (role === "BacSi") {
      navigate("/doctor");
    } else if (role === "clinic") {
      navigate("/clinic");
    } else if (role === "user") {
      navigate("/trang-chu");
    } else if (role === "admin") {
      navigate("/admin");
    }
  };
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">Trang bạn tìm kiếm không tồn tại.</p>
      <p className="notfound-description">
        Có thể đường dẫn đã bị thay đổi hoặc bạn đã nhập sai địa chỉ.
      </p>
      <button className="notfound-btn" onClick={handelRoutingNotfound}>
        Quay về trang chủ
      </button>
    </div>
  );
};

export default NotFound;
