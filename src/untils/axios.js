import axios from 'axios';

// Tạo một thực thể axios với cấu hình base
const instance = axios.create({
    // THAY CỔNG 8080 BẰNG CỔNG XỊN CỦA BRO NẾU BRO CHẠY CỔNG KHÁC NHÉ
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000, // Đợi 10 giây, nếu Backend không trả lời thì tự ngắt
});

// Cấu hình Request: Tự động chạy trước khi gửi API (Sau này nhét Token đăng nhập vào đây)
instance.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Cấu hình Response: Tự động chạy khi Backend trả data về
instance.interceptors.response.use(
    (response) => {
        // Bóc tách luôn phần data, mốt gọi API xong không cần gõ .data nữa
        return response.data;
    },
    (error) => {
        console.error("Lỗi gọi API nè bro:", error);
        return Promise.reject(error);
    }
);

export default instance;