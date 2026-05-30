import axiosClient from "../../utils/axios";

const Base_url = 'api/v1/adminsystem/subscriptionpackage';

const subscriptionPackageService = {

    searchSubscriptionpackage: (searchRequest) => axiosClient.post(`${Base_url}/search`, searchRequest),

    createSubscriptionpackage: (request) => axiosClient.post(`${Base_url}/create`, request),

    updateSubscriptionpackage: (maGoi, request) => axiosClient.put(`${Base_url}/update/${maGoi}`, request),
    
    deleteSubscriptionpackage: (maGoi) => axiosClient.delete(`${Base_url}/delete/${maGoi}`),
};
export default subscriptionPackageService;