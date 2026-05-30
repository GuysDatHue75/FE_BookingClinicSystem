import axiosClient from "../../utils/axios";

const featureService = {
    // Gọi API GET theo đúng URL backend cung cấp
    getAllFeatures: () => axiosClient.get(`api/v1/adminsystem/features`),
};

export default featureService;