import React, { createContext, useState, useContext, useEffect } from "react";
// import apiClient from "../api/api";
import apiClient from "../utils/axios";
import clinicsService from "../services/clinic/ClinicsService";
import { State } from "../state/context";

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
  const { setProfileClinic } = useContext(State);

  // Load user info từ localStorage khi app khởi động
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const accountInfo = userData.account || userData.taiKhoan || userData; // Tùy response mà backend trả về
          if(accountInfo) {
          // Transform user data để khớp với format Layout.jsx cần
          const transformedUser = {
            ...userData,
            roleName: mapRoleToRoleName(accountInfo.vaiTro),
            fullName: accountInfo.hoVaTen || userData.hoVaTen || "Người dùng",
            avatar: userData.avatar || userData.anhPhongKham || "",
            maTaiKhoan: accountInfo.maTaiKhoan,
            maBenhNhan: userData.maBenhNhan,
            queQuan: userData.queQuan || userData.tinhThanhPho || "",
            rawRole: accountInfo.vaiTro
          };
          setUser(transformedUser);
          }
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
        phone: phone.trim(),
        pass: password,
        otp: ""
      };

      const response = await apiClient.post('/api/v1/login', body);
      const userData = response;
      const accountInfo = userData.account || userData.taiKhoan || userData; // Tùy response mà backend trả về

      // Lưu vào LocalStorage và State
      if (accountInfo?.vaiTro) {
        // let fullClinicData = null;
        // Lưu vào localStorage
        localStorage.setItem("role", accountInfo.vaiTro);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("idPatient", userData.maBenhNhan);
        localStorage.setItem("idAccount", accountInfo.maTaiKhoan);

        if (accountInfo.vaiTro === "PhongKham") {
          try{
            const fullClinicData = await clinicsService.getDetail(userData.maPhongKham);
            setProfileClinic(fullClinicData);
            localStorage.setItem("idPhongKham", userData.maPhongKham);
            localStorage.setItem("profileClinic", JSON.stringify(fullClinicData));
          } catch (e) {
              console.error("Không lấy được được thông tin phòng khám:");
          }
        }

        // Transform user data để khớp với format Layout.jsx cần
        const transformedUser = {
          ...userData,
          roleName: mapRoleToRoleName(accountInfo.vaiTro),
          fullName: accountInfo.hoVaTen || userData.hoVaTen || "Người dùng",
          avatar: userData.avatar || userData.anhPhongKham || "",
          maTaiKhoan: accountInfo.maTaiKhoan,
          maBenhNhan: userData.maBenhNhan || "",
          queQuan: userData.queQuan || userData.tinhThanhPho || "",
          rawRole: accountInfo.vaiTro
        };

        setUser(transformedUser);

        return { success: true, user: transformedUser, role: transformedUser.roleName };
      }

      return { success: false, message: "Không tìm thấy vai trò trong response" };
    } catch (error) {
      return { success: false, message: error.response?.data || "Đăng nhập thất bại" };
    }
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("idPatient");
    localStorage.removeItem("idAccount");
    localStorage.removeItem("profileClinic");
    localStorage.removeItem("idPhongKham");
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