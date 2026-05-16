import React, { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../api/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Map vaiTro từ Backend sang roleName cho frontend
const mapRoleToRoleName = (vaiTro) => {
  const roleMap = {
    "BenhNhan": "user",
    "BacSi": "doctor",
    "PhongKham": "clinic",
    "Admin": "admin"
  };
  return roleMap[vaiTro] || "admin"; // Default là admin nếu không khớp
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user info từ localStorage khi app khởi động
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Transform user data để khớp với format Layout.jsx cần
          const transformedUser = {
            ...userData,
            roleName: mapRoleToRoleName(userData.taiKhoan?.vaiTro),
            fullName: userData.taiKhoan?.hoTen || userData.ten || "Người dùng",
            avatar: userData.avatar || "",
            maTaiKhoan: userData.taiKhoan?.maTaiKhoan,
            maBenhNhan: userData.maBenhNhan,
            queQuan: userData.queQuan
          };
          setUser(transformedUser);
        } catch (error) {
          console.error("Lỗi parse user từ localStorage:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("role");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Hàm login - Gọi API Backend
  const login = async (phone, password) => {
    try {
      const body = {
        phone: phone,
        pass: password,
        otp: ""
      };

      const response = await apiClient.post('/api/v1/login', body);
      const userData = response.data;

      if (userData.taiKhoan?.vaiTro) {
        // Lưu vào localStorage
        localStorage.setItem("role", userData.taiKhoan.vaiTro);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("idPatient", userData.maBenhNhan);
        localStorage.setItem("idAccount", userData.taiKhoan.maTaiKhoan);
        localStorage.setItem("city", userData.queQuan);

        // Transform user data để khớp với format Layout.jsx cần
        const transformedUser = {
          ...userData,
          roleName: mapRoleToRoleName(userData.taiKhoan.vaiTro),
          fullName: userData.taiKhoan?.hoTen || userData.ten || "Người dùng",
          avatar: userData.avatar || "",
          maTaiKhoan: userData.taiKhoan.maTaiKhoan,
          maBenhNhan: userData.maBenhNhan,
          queQuan: userData.queQuan
        };

        setUser(transformedUser);

        return { success: true, user: transformedUser, role: transformedUser.roleName };
      }

      return { success: false, message: "Không tìm thấy vai trò trong response" };
    } catch (error) {
      console.error("Lỗi login:", error);
      const message = error.response?.data || "Đăng nhập thất bại";
      return { success: false, message };
    }
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("idPatient");
    localStorage.removeItem("idAccount");
    localStorage.removeItem("city");
    setUser(null);
    window.location.href = "/login";
  };

  // Hàm cập nhật user info
  const updateUser = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;