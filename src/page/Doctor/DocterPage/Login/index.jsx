import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { State } from "../../../../state/context";
import iconLogin from "../../../../assets/image/login.png";
import iconLogo from "../../../../assets/image/logo.png";
import bcg from "../../../../assets/image/backgroundBody.webp";
import apiClient from '../../../../api/api'
// import apiClient from "../../../../utils/axios";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); //
  const { setRole } = useContext(State);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const handleLogin = async () => {

    const body = {
      phone: phone,
      pass: password,
      otp: ""
    }

    if (phone === "" || password === "") {
      setError("vui lòng nhập thông tin");
      return;
    }
    try {

      console.log(phone, password);

      const response = await apiClient.post('/api/v1/login', body);
      console.log(response);

      if (response.data.taiKhoan?.vaiTro) {
        localStorage.setItem("role", response.data.taiKhoan.vaiTro);
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("idDoctor", response.data.maBacSi || "");
        localStorage.setItem("idPatient", response.data.maBenhNhan || "");
        localStorage.setItem("idAccount", response.data.taiKhoan.maTaiKhoan || "");
        localStorage.setItem("city", response.data.queQuan || "");
        setRole(response.data.taiKhoan.vaiTro);
      } else if (response.data.account?.vaiTro) {
        localStorage.setItem("idPhongKham", response.data.maPhongKham || "");
        localStorage.setItem("idAccount", response.data.account.maTaiKhoan || "");
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("role", response.data.account?.vaiTro);
      }else if(response.data.vaiTro){
        localStorage.setItem("idAccount", response.data.maTaiKhoan || "");
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("role", response.data.vaiTro);

      }
      let roleApi = "";

      if (response.data.taiKhoan?.vaiTro) {
        roleApi = response.data.taiKhoan.vaiTro;
      } else {
        roleApi = response.data.account?.vaiTro || response.data?.vaiTro;
      }
      // const roleApi = !response.data.taiKhoan.vaiTro || response.data.account?.vaiTro;
      console.log(roleApi);
      if (roleApi === "BenhNhan") {
        if (response.data.taiKhoan.lanDauDangNhap === 1) {
          navigate("/chon-tinhthanh");
        } else {
          navigate("/trang-chu");
        }
      } else if (roleApi === "BacSi") {
        navigate("/doctor") 
      } else if (roleApi === "PhongKham") {
        navigate("/clinic")
      } else {
        navigate("/admin")
      }
    } catch (err) {
      const message = err.response?.data;
      if (err.response?.status === 401) {
        setError(message || "Sai mật khẩu");
      } else if (err.response?.status === 404) {
        setError(message || "Tài khoản không tồn tại");
      } else { setError("Đã có lỗi xảy ra"); }
    }

    // if (phone == "" || password == "") {
    //   setError("vui lòng nhập thông tin");
    //   return;
    // }

    // const result = await login(phone, password);
    // if(result.success){
    //   const userData = result.user;
    //   const roleApi = userData.rawRole || userData.account?.vaiTro || userData.taiKhoan?.vaiTro;
    //   setRole(roleApi);
    //   if (roleApi === "BenhNhan") {
    //     if (userData.taiKhoan?.lanDauDangNhap === 1 || userData.account?.lanDauDangNhap === 1) {
    //       navigate("/chon-tinhthanh");
    //     } else {
    //       navigate("/trang-chu");
    //     }
    //   } else if (roleApi === "BacSi") {
    //     navigate("/doctor")
    //   } else if (roleApi === "PhongKham") {
    //     navigate("/clinic")
    //   } else if (roleApi === "Admin") {
    //     navigate("/admin")
    //   } else {
    //     setError("Vai trò không hợp lệ");
    //   }
    // } else {
    //     setError(result.message || "Đăng nhập thất bại");
    // }
    // } catch (err) {
    //   const message = err.response?.data || err.response;
    //   if (err.response?.status === 401) {
    //     setError(message || "Sai mật khẩu");
    //   } else if (err.response?.status === 404) {
    //     setError(message || "Tài khoản không tồn tại");
    //   } else { setError("Đã có lỗi xảy ra"); }
    // }
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };
  const loginWithFacebook = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
  };
  return (
    <div className="login-container">
      <img className="bcg-login" src={bcg} alt="bcg" />
      <div className="wrapper-container">
        <div className="login-image">
          <img src={iconLogin} alt="Doctors" />
        </div>

        <div className="login-box">
          <div className="logo-box">
            <img className="logo" src={iconLogo} alt="Logo" />
          </div>

          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {error && <div className="error-message">{error}</div>}
          <button onClick={handleLogin}>Đăng nhập</button>

          <div className="links">
            <a href="/forgotPassword">Quên mật khẩu?</a> |{" "}
            <a href="/register">Đăng ký?</a>
          </div>
          <div className="social-login">
            <span>Hoặc đăng nhập bằng</span>
            <div className="social-icons">
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                alt="Facebook"
                onClick={loginWithFacebook}
              />
              <img
                src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                alt="Google"
                onClick={loginWithGoogle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
