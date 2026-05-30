import axiosClient from "../../utils/axios";

const BASE_URL = 'api/v1/adminclinic/specialty';

const specialtyService = {
    // Lấy tất cả chuyên khoa
    getAllSpecialties: (maPhongKham) => 
        axiosClient.get(`${BASE_URL}/all/${maPhongKham}`),

    // Tìm kiếm chuyên khoa
    searchSpecialties: (maPhongKham, searchRequest) => 
        axiosClient.post(`${BASE_URL}/search/${maPhongKham}`, searchRequest),

    // Xem chi tiết 
    getDetail: (maPhongKham, maChuyenKhoa) => 
        axiosClient.get(`${BASE_URL}/detail/${maPhongKham}/${maChuyenKhoa}`),

    // Thêm mới
    createSpecialty: (maPhongKham, request) => 
        axiosClient.post(`${BASE_URL}/create/${maPhongKham}`, request),

    // Sửa 
    updateSpecialty: (maPhongKham, maChuyenKhoa, request) => 
        axiosClient.put(`${BASE_URL}/update/${maPhongKham}/${maChuyenKhoa}`, request),

    // Xóa
    deleteSpecialty: (maPhongKham, maChuyenKhoa) => 
        axiosClient.delete(`${BASE_URL}/delete/${maPhongKham}/${maChuyenKhoa}`),
};

export default specialtyService;