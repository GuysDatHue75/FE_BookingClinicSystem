import axiosClient from "../../utils/axios";

const BASE_URL = 'api/v1/adminclinic/clinic';

const clinicsService = {
    // Lấy thông tin chi tiết phòng khám
    getDetail: (maPhongKham) => 
        axiosClient.get(`${BASE_URL}/detail/${maPhongKham}`),

    // Cập nhật thông tin phòng khám
    updateClinic: (maPhongKham, clinicData) => {
        const formData = new FormData();
        Object.keys(clinicData).forEach((key) => {
            if(
                key !== "anhPhongKham" &&
                key !== "giayPhep"
            ) {
                formData.append(key, clinicData[key]);
            }
        });
            if (clinicData.anhPhongKham instanceof File) {
                    formData.append("anhPhongKham", clinicData.anhPhongKham);
            }

    // append file giấy phép nếu có
            if (clinicData.giayPhep instanceof File) {
                formData.append("giayPhep", clinicData.giayPhep);
            }

            return axiosClient.put(`${BASE_URL}/update/${maPhongKham}`,formData,{
                    headers: {"Content-Type": "multipart/form-data",},
                });
    },
};

export default clinicsService;