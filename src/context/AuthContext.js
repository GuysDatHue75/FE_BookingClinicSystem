import React, { createContext, useState, useContext, useEffect } from "react";
import axiosClient from "../utils/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Load user info từ localStorage khi app khởi động
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Lỗi phân tích user từ localStorage:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Hàm login - Gọi API Backend
  const login = async (phone, password) => {
    try {
      const response = await axiosClient.post("/auth/login", {
        phone,
        password,
      });

      // Backend trả về: { token, user: { id, fullName, roleName, avatar, ... } }
      const { token: newToken, user: userData } = response;

      // Lưu vào localStorage
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Lưu role cho compatibility với code cũ
      localStorage.setItem("role", JSON.stringify(userData.roleName));

      // Update state
      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Lỗi login:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Đăng nhập thất bại" 
      };
    }
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  // Hàm cập nhật user info (sau khi edit profile, đổi avatar, v.v.)
  const updateUser = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;