// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Thêm dòng này để lấy chức năng Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD98VK6usrYByiBq62kOVcl76FoawZG4s",
  authDomain: "booking-clinic-51caa.firebaseapp.com",
  projectId: "booking-clinic-51caa",
  storageBucket: "booking-clinic-51caa.firebasestorage.app",
  messagingSenderId: "652556351974",
  appId: "1:652556351974:web:230a6562dd6dc44014fe27",
  measurementId: "G-51XVM2D9YR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORT CÁC DỊCH VỤ ĐỂ FILE KHÁC DÙNG ĐƯỢC
export const analytics = getAnalytics(app); 
export const auth = getAuth(app); // Bắt buộc phải có dòng này để file Register.jsx gọi được auth