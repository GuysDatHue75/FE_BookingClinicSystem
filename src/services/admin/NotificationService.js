import axiosClient from "../../utils/axios";

const Base_url = 'api/v1/adminsystem/notification';

const notificationService = {

    searchNotification: (searchRequest) => axiosClient.post(`${Base_url}/search`, searchRequest),

    createNotification: (request) => axiosClient.post(`${Base_url}/create`, request, {
        headers: { "Content-Type": "multipart/form-data" }
    }),

    updateNotification: (request) => axiosClient.put(`${Base_url}/update/${request.get("maThongBao")}`, request, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
    
    deleteNotification: (maThongBao) => axiosClient.delete(`${Base_url}/delete/${maThongBao}`),

    detailNotification: (maThongBao) => axiosClient.get(`${Base_url}/detail/${maThongBao}`),
};
export default notificationService;