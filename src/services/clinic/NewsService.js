import axiosClient from "../../utils/axios";

const BASE_URL = 'api/v1/adminclinic/news';

const newsService = {
    // Tìm kiếm tin tức có phân trang
    searchNews: (maPhongKham, searchRequest) => 
        axiosClient.post(`${BASE_URL}/search/${maPhongKham}`, searchRequest),

    // Xem chi tiết
    getDetail: (maPhongKham, maTinTuc) => 
        axiosClient.get(`${BASE_URL}/${maPhongKham}/${maTinTuc}`),

    // Thêm mới
    createNews: (maPhongKham, formData) => 
        axiosClient.post(`${BASE_URL}/create/${maPhongKham}`, formData),

    // Cập nhật
    updateNews: (maTinTuc, maPhongKham, formData) => 
        axiosClient.put(`${BASE_URL}/update/${maTinTuc}/${maPhongKham}`, formData),

    // Xóa
    deleteNews: (maPhongKham, maTinTuc) => 
        axiosClient.delete(`${BASE_URL}/${maTinTuc}/${maPhongKham}`),
};

export default newsService;