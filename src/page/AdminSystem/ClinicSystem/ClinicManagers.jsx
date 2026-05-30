import React, { useState, useEffect } from "react";
import ClinicRequestTable from "./ListClinicManager";
import ClinicManagerDetail from "./ClinicManagerDetail";
import styles from "./ClinicManager.module.css"; 
import clinicService from "../../../services/admin/ClinicService"; 

const ClinicManagers = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE TỈNH THÀNH (LẤY TỪ API) ---
  const [provinces, setProvinces] = useState([]);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  // 1. GỌI API LẤY DANH SÁCH TỈNH THÀNH
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        if (!response.ok) return;
        const result = await response.json();
        
        // API esgoo trả về mảng tỉnh thành nằm trong result.data
        if (result.error === 0) {
          setProvinces(result.data);
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu tỉnh thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  // GỌI API LẤY DANH SÁCH PHÒNG KHÁM BẰNG SEARCH API
  const fetchClinics = async () => {
    setIsLoading(true);
    try {
      const pageIndex = currentPage - 1; 

      // Gói dữ liệu gửi xuống body của phương thức POST
      const searchPayload = {
        keyword: searchTerm.trim(),
        tinhThanhPho: filterCity === "all" ? "" : filterCity,
        trangThai: filterStatus === "all" ? "" : filterStatus,
        loaiHinhPhongKham: filterType === "all" ? "" : filterType,
        page: pageIndex,
        size: size,
        
        // Bổ sung các trường trống để phòng trường hợp Backend báo lỗi Null Pointer
        nguoiDaiDien: "",
        diaChi: "",
        maGoi: ""
      };

      // 💥 SỬ DỤNG CHÍNH XÁC HÀM SEARCH CỦA BẠN 
      const response = await clinicService.searchClinics(searchPayload); 
      
      // Axios thường bọc dữ liệu trong biến "data", nếu bạn có dùng interceptor thì bỏ ".data" đi
      // Hãy F12 tab Network xem response trả về chữ "content" hay nằm trong "data.content" nhé
      const responseData = response; 

      setRequests(responseData.content || []);
      setTotalPages(responseData.totalPages || 1);
      
    } catch (error) {
      console.error("Lỗi lấy danh sách phòng khám:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [currentPage, filterCity, filterStatus, filterType]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1); 
      else fetchClinics();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Hành động Xóa
  const handleDelete = async (maPhongKham) => {
    if (!window.confirm("Cảnh báo: Xác nhận XÓA VĨNH VIỄN phòng khám này khỏi hệ thống?")) return;
    try {
      await clinicService.deleteClinic(maPhongKham);
      alert("Đã xóa phòng khám thành công!");
      setShowDetailModal(false); 
      fetchClinics(); 
    } catch (error) {
      console.error("Lỗi xóa phòng khám:", error);
      alert("Lỗi hệ thống khi xóa phòng khám!");
    }
  };

  const handleViewDetails = async (request) => {
    try {
      const detailData = await clinicService.detailClinic(request.maPhongKham || request.id);
      setSelectedRequest(detailData);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      setSelectedRequest(request);
      setShowDetailModal(true);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý phòng khám</h1>
      
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, người đại diện hoặc địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

        {/* 3 BỘ LỌC ĐỘC LẬP */}
        <div className={styles.filterGroup}>
          
          {/* 💥 DROP-DOWN TỈNH THÀNH (MAP TỪ API) */}
          <select value={filterCity} onChange={(e) => {setFilterCity(e.target.value); setCurrentPage(1);}} className={styles.filterSelect}>
            <option value="all">Tất cả Tỉnh/TP</option>
            {provinces.map((province) => (
              // Dùng province.name (vd: "Hà Nội") hoặc province.full_name (vd: "Thành phố Hà Nội") 
              // tùy thuộc vào cách Backend của bạn lưu dữ liệu nhé. Ở đây mình ưu tiên full_name cho trang trọng.
              <option key={province.id} value={province.full_name}>
                {province.full_name}
              </option>
            ))}
          </select>

          <select value={filterType} onChange={(e) => {setFilterType(e.target.value); setCurrentPage(1);}} className={styles.filterSelect}>
            <option value="all">Tất cả Loại hình</option>
            <option value="Phòng khám đa khoa tư nhân">Đa khoa</option>
            <option value="Phòng khám chuyên khoa Nhi">Nhi khoa</option>
            <option value="Phòng khám chuyên khoa Da liễu">Da liễu</option>
          </select>

          <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} className={styles.filterSelect}>
            <option value="all">Tất cả Trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Ngừng hoạt động">Ngừng hoạt động</option>
            <option value="Bị khóa">Bị khóa</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
      ) : (
        <ClinicRequestTable
          requests={requests}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {showDetailModal && selectedRequest && (
        <ClinicManagerDetail
          request={selectedRequest}
          onClose={() => setShowDetailModal(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ClinicManagers;