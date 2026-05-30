import axiosClient from "../../utils/axios"; 

const BASE_URL = '/api/v1/adminclinic/notification';

const notificationService = {
    // Tìm kiếm/Lấy danh sách thông báo
    searchSentNotifications: (searchRequest) => 
        axiosClient.post(`${BASE_URL}/sent/search`, searchRequest),

    // 💥 Dùng cho chuông thông báo sau này
    searchReceivedNotifications: (searchRequest) => 
        axiosClient.post(`${BASE_URL}/received/search`, searchRequest),

    // Lấy số lượng thông báo chưa đọc
    getUnreadCount: (maTaiKhoan) => 
        axiosClient.get(`${BASE_URL}/unread-count`, { params: { maTaiKhoan } }),

    // Xem chi tiết thông báo
    detailNotification: (maThongBao) => 
        axiosClient.get(`${BASE_URL}/${maThongBao}`),

    // Đánh dấu đã đọc
    markAsRead: (maThongBao, maTaiKhoan) => 
        axiosClient.put(`${BASE_URL}/${maThongBao}/${maTaiKhoan}/read`),

    // Tạo thông báo mới (Gửi FormData)
    createNotification: (formData) => 
        axiosClient.post(`${BASE_URL}/create`, formData),

    // Sửa thông báo (Gửi FormData)
    updateNotification: (maThongBao, formData) => 
        axiosClient.put(`${BASE_URL}/update/${maThongBao}`, formData),

    // Xóa thông báo
    deleteNotification: (maThongBao) => 
        axiosClient.delete(`${BASE_URL}/delete/${maThongBao}`),
};

export default notificationService;