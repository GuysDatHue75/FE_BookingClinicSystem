import axiosClient from "../../utils/axios";

const Base_url = 'api/v1/adminsystem/browse-clinic';

const browseClinicService = {
    getPendingClinics: (page = 0, size = 10) => axiosClient.get(`${Base_url}/pending`, {params: {page: page,size: size}}),

    getAllClinics: (page = 0, size = 10) => axiosClient.get(`${Base_url}/all`, {params: {page, size}}),

    searchClinics: (searchRequest) => axiosClient.post(`${Base_url}/search`, searchRequest),
    
    handleBrowseClinic: (maPhongKham, actionRequest) => axiosClient.post(`${Base_url}/${maPhongKham}/browse`, actionRequest),

    detailBrowseClinic: (maPhongKham) => axiosClient.get(`${Base_url}/detail/${maPhongKham}`),
};
export default browseClinicService;