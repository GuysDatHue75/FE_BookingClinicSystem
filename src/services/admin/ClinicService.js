import axiosClient from "../../utils/axios";

const Base_url = 'api/v1/adminsystem/clinic';

const clinicService = {

    getAllClinics: (searchRequest) => axiosClient.get(`${Base_url}`, { params: searchRequest }),

    searchClinics: (searchRequest) => axiosClient.post(`${Base_url}/search`, searchRequest),
    
    deleteClinic: (maPhongKham) => axiosClient.delete(`${Base_url}/${maPhongKham}/delete`),

    detailClinic: (maPhongKham) => axiosClient.get(`${Base_url}/${maPhongKham}`),
};
export default clinicService;