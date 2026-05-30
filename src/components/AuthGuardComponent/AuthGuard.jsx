import React from "react";
import { Navigate } from "react-router-dom";
import "./AuthGuard.css";

const AuthGuard = ({ role, children }) => {
  if (role !== "BenhNhan") {
    return (
      <div className="auth-overlay">
        <div className="auth-box">
          <h2>Bạn chưa đăng nhập</h2>
          <p>Vui lòng đăng nhập để tiếp tục sử dụng hệ thống</p>
          <button onClick={() => (window.location.href = "/login")}>
            Đi đến đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;