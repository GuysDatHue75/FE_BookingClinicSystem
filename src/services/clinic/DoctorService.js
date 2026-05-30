import axiosClient from "../../utils/axios";

const BASE_URL = 'api/v1/adminclinic/doctor';

const doctorService = {
    // Lấy tất cả bác sĩ (Không phân trang)
    getAllDoctors: (maPhongKham) => 
        axiosClient.get(`${BASE_URL}/all/${maPhongKham}`),

    // Tìm kiếm bác sĩ (Dùng POST để gửi body request)
    searchDoctors: (maPhongKham, searchRequest) => 
        axiosClient.post(`${BASE_URL}/search/${maPhongKham}`, searchRequest),

    // Lấy chi tiết một bác sĩ
    getDoctorDetail: (maBacSi) => 
        axiosClient.get(`${BASE_URL}/detail/${maBacSi}`),

    // Tạo mới bác sĩ
    createDoctor: (maPhongKham, request) => 
        axiosClient.post(`${BASE_URL}/create/${maPhongKham}`, request),

    // Xóa bác sĩ
    deleteDoctor: (maBacSi) => 
        axiosClient.delete(`${BASE_URL}/delete/${maBacSi}`),

    // Lấy danh sách bác sĩ rút gọn để render Checkbox
    getActiveBasicDoctors: (maPhongKham) => 
        axiosClient.get(`${BASE_URL}/active-basic/${maPhongKham}`),
};

export default doctorService;