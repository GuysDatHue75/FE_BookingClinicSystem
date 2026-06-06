import axiosClient from "../../utils/axios";

const accountService = {
  searchAccounts: (payload) => {
    return axiosClient.post("/api/v1/adminsystem/account/search", payload);
  },

  getAccountDetail: (maTaiKhoan) => {
    return axiosClient.get(`/api/v1/adminsystem/account/detail/${maTaiKhoan}`);
  },

  createAccount: (payload) => {
    return axiosClient.post("/api/v1/adminsystem/account/create", payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateAccount: (maTaiKhoan, payload) => {
    return axiosClient.post(`/api/v1/adminsystem/account/update/${maTaiKhoan}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteAccount: (maTaiKhoan) => {
    return axiosClient.delete(`/api/v1/adminsystem/account/delete/${maTaiKhoan}`);
  }
};

export default accountService;