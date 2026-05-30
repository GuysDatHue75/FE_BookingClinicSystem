import React, { useState } from "react";
import "./ForgotPassword.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bcg from "../../../../assets/image/backgroundBody.webp";
import logo from "../../../../assets/image/logo.png";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../../api/api";

const ForgotPassword = () => {
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  // const role = JSON.parse(localStorage.getItem("role"));
  const navigate = useNavigate();

  const isPhoneNumber = (value) => {
    return /^(0|\+84)[0-9]{9,10}$/.test(value);
  };

  const isEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isPhoneNumber(inputValue)) {
        await apiClient.post("/api/v1/forgot-password/phone", {
          soDt: inputValue,
        });

        toast.success("OTP đã gửi về số điện thoại");
      }

      else if (isEmail(inputValue)) {
        await apiClient.post("/api/v1/forgot-password/email", {
          email: inputValue,
        });

        toast.success("OTP đã gửi về email");
      }

      else {
        setError("Vui lòng nhập email hoặc số điện thoại hợp lệ!");
        return;
      }

      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Có lỗi xảy ra!");
    }
  };

  // verify otp
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const body = {
        otp: otp,
      };

      if (isPhoneNumber(inputValue)) {
        body.soDt = inputValue;
      } else {
        body.email = inputValue;
      }

      await apiClient.post("/api/v1/verify-otp", body);

      toast.success("Xác thực OTP thành công!");

      setVerified(true);

      setStep(3);
    } catch (err) {
      setError(err.response?.data || "OTP không đúng!");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const body = {
        newPassword: newPassword,
      };

      if (isPhoneNumber(inputValue)) {
        body.soDt = inputValue;
      } else {
        body.email = inputValue;
      }

      await apiClient.post("/api/v1/reset-password", body);

      toast.success("Đổi mật khẩu thành công!", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <>
      <img className="bcg-login" src={bcg} alt="bcg" />

      <div className="login-container">
        <div className="login-box">

          <div className="logo-box">
            <img className="logo" src={logo} alt="Logo" />
          </div>

          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <h2>Quên mật khẩu</h2>

              <p className="form-text">
                Nhập email hoặc số điện thoại
              </p>

              <input
                type="text"
                placeholder="Email hoặc số điện thoại"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                // style={{ width: role === "user" ? "93%" : "85%" }}
              />

              {error && <p className="error">{error}</p>}

              <button type="submit">
                Gửi OTP
              </button>

              <div className="links">
                <a href="/login">Quay lại đăng nhập</a>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <h2>Xác thực OTP</h2>

              <p className="form-text">
                Nhập mã OTP đã được gửi
              </p>

              <input
                type="text"
                placeholder="Nhập OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              {error && <p className="error">{error}</p>}

              <button type="submit">
                Xác thực OTP
              </button>
            </form>
          )}

          {step === 3 && verified && (
            <form onSubmit={handleChangePassword}>
              <h2>Đặt mật khẩu mới</h2>

              <p className="form-text">
                Nhập mật khẩu mới cho tài khoản của bạn
              </p>

              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {error && <p className="error">{error}</p>}

              <button type="submit">
                Đổi mật khẩu
              </button>
            </form>
          )}

        </div>
      </div>
    </>
  );
};

export default ForgotPassword;