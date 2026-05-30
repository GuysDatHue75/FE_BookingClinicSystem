import axios from 'axios';

// Tạo một thực thể axios với cấu hình base
const axiosClient = axios.create({
    // THAY CỔNG 8080 BẰNG CỔNG XỊN CỦA BRO NẾU BRO CHẠY CỔNG KHÁC NHÉ
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    timeout: 10000, // Đợi 10 giây, nếu Backend không trả lời thì tự ngắt
    headers: {"Content-Type": 'application/json'}
});

// Cấu hình Request: Tự động chạy trước khi gửi API (Sau này nhét Token đăng nhập vào đây)
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Cấu hình Response: Tự động chạy khi Backend trả data về
axiosClient.interceptors.response.use(
    (response) => {
        // Bóc tách luôn phần data, mốt gọi API xong không cần gõ .data nữa
        return response.data;
    },
    (error) => {
        if(error.response){
            const status = error.response.status;
            if(status === 401){
                console.error("Token hết hạn hoặc chưa đăng nhập!");
                localStorage.removeItem('Token');
                window.location.href = '/login';
            } else if(status === 403){
                console.error("Bạn không có quyền truy cập tính năng này!");
            } else if(status === 500){
                console.error("Lỗi Server (Backend Spring Boot đang có vấn đề");
            }
        } else {
            console.error("Lỗi Network hoặc Backend không phản hồi:", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;