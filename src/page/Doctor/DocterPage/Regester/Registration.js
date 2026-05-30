import React, { useState } from "react";
import styles from "./Registration.module.css";
import bcg from "../../../../assets/image/backgroundBody.webp";
import iconLogin from "../../../../assets/image/login.png";
import { auth } from "../../../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import apiClient from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import MessageModal from "../../../../components/ConfirmModal/MessageModal";
export default function Register() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [registerS, setRegisterS] = useState(false);

  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const validatePhone = (p) => /^((\+84)|0)\d{9}$/.test(p);
  const validatePassword = (p) => /(?=.*[0-9])(?=.*[a-zA-Z]).{6,}/.test(p);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    }
  };
 
  const handleNext = async () => {
    setError("");
    if (!phone || !password) return setError("Vui lòng nhập đầy đủ thông tin.");
    if (!validatePhone(phone)) return setError("Số điện thoại không hợp lệ.");
    if (!validatePassword(password)) return setError("Mật khẩu ít nhất 6 ký tự, gồm chữ và số.");

    setSendingOtp(true);
    try {
      const checkResponse = await apiClient.get(`/api/v1/check-phone?phone=${phone}`);

      if (checkResponse.data.exists) {
        setError("Số điện thoại này đã được đăng ký! Vui lòng đăng nhập.");
        setSendingOtp(false);
        return;
      }

      setupRecaptcha();
      const formatPhone = phone.startsWith("0") ? "+84" + phone.slice(1) : phone;

      const confirmation = await signInWithPhoneNumber(auth, formatPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);

      setStep(2);

    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra (Không thể kết nối máy chủ hoặc gửi OTP).");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setSendingOtp(false);
    }
  };
   const handleKeyDownRegister = (e) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const handleChangeOtp = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return setError("Nhập đủ 6 chữ số OTP.");
    setError("");

    try {
      const result = await confirmationResult.confirm(code);
      const idToken = await result.user.getIdToken();

      await apiClient.post("/api/v1/register", {
        idToken: idToken,
        password: password,
        phone: phone
      });

      setRegisterS(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError("Mã OTP không đúng hoặc có lỗi xảy ra.");
    }
  };

  const handleResend = async () => {
    setError("");
    setSendingOtp(true);
    try {
      const formatPhone = phone.startsWith("0") ? "+84" + phone.slice(1) : phone;
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtp(new Array(6).fill(""));
    } catch (err) {
      setError("Lỗi khi gửi lại mã OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <>
      {registerS && <div><MessageModal isOpen={true} title={"Đăng ký thành công."} type="success" /></div>}
      <img className="bcg-login" src={bcg} alt="bcg" />
      <div className={styles.container}>
        <div id="recaptcha-container"></div>
        <div className={styles.card}>
          {step === 1 && (
            <div className="login-container">
              <img className="bcg-login" src={bcg} alt="bcg" />
              <div className="wrapper-container">
                <div className="login-image">
                  <img src={iconLogin} alt="Doctors" />
                </div>
                <div className="login-box">
                  <div className="logo-box"><h2>Đăng ký tài khoản</h2></div>
                  <input type="text" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={handleKeyDownRegister}/>
                  <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDownRegister} />
                  {error && <div className="error-message">{error}</div>}
                  <button className={styles.nextBtn} onClick={handleNext} disabled={sendingOtp}>
                    {sendingOtp ? "Gửi mã..." : "Tiếp"}
                  </button>
                  <div className="social-login">
                    <span>Hoặc đăng ký bằng</span>
                    <div className="social-icons">
                      <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" onClick={() => window.location.href = `${apiUrl}/oauth2/authorization/facebook`} />
                      <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google" onClick={() => window.location.href = `${apiUrl}/oauth2/authorization/google`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.otpWrap}>
              <p className={styles.subtitle}>Nhập mã OTP đã gửi tới <strong>{phone}</strong></p>
              <div className={styles.otpInputs}>
                {otp.map((v, i) => (
                  <input key={i} id={`otp-${i}`} className={styles.otp} value={v} onChange={(e) => handleChangeOtp(e, i)} onKeyDown={(e) => handleKeyDown(e, i)} inputMode="numeric" />
                ))}
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.actions}>
                <button className={styles.verifyBtn} onClick={handleVerify}>Xác nhận</button>
                <button className={styles.resendBtn} onClick={handleResend} disabled={sendingOtp}>
                  {sendingOtp ? "Đang gửi..." : "Gửi lại mã"}
                </button>
              </div>
              <button className={styles.backLink} onClick={() => { setStep(1); setError(""); }}>Quay lại</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}