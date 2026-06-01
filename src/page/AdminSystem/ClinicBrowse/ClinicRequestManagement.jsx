import React, { useState, useEffect } from "react";
import ClinicRequestTable from "./ClinicRequestTable";
import ClinicRequestDetails from "./ClinicBrowseDetail";
import styles from "./ClinicBrowse.module.css";
// IMPORT SERVICE GỌI API VÀO ĐÂY
import browseClinicService from "../../../services/admin/BrowseClinicService"; 

const ClinicRequestManagement = () => {
  // State quản lý dữ liệu từ API
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State tương tác UI
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Chờ duyệt");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State phân trang (Frontend bắt đầu từ 1, Spring Boot bắt đầu từ 0)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10; // Số lượng hiển thị trên 1 trang

  // Hàm gọi API trung tâm
  const fetchClinics = async () => {
    setIsLoading(true);
    try {
      const pageIndex = currentPage - 1; // Convert sang chuẩn Spring Boot
      let response;

      // Logic rẽ nhánh API dựa trên filter và search
      if (searchTerm.trim() !== "" || filter === "Đã duyệt" || filter === "Đã từ chối") {
        // Gọi API Search (Nhớ cấu hình body request khớp với BrowseClinicSearchRequest)
        const searchRequest = { 
          keyword: searchTerm.trim(), 
          trangThai: filter === "all" ? "" : filter,
          page: pageIndex,
          size: size
        };
        response = await browseClinicService.searchClinics(searchRequest);
      } else if (filter === "Chờ duyệt") {
        response = await browseClinicService.getPendingClinics(pageIndex, size);
      } else {
        response = await browseClinicService.getAllClinics(pageIndex, size);
      }

      // Đổ dữ liệu từ Spring Boot (thường nằm trong response.content) vào State
      setRequests(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Lỗi lấy danh sách phòng khám:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Kích hoạt gọi API khi Filter hoặc CurrentPage thay đổi
  useEffect(() => {
    fetchClinics();
  }, [currentPage, filter]);

  // Debounce Search: Đợi người dùng gõ xong 500ms mới gọi API
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Khi search thì tự động quay về trang 1
      if (currentPage !== 1) {
        setCurrentPage(1); 
      } else {
        fetchClinics();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Hành động Duyệt
  const handleApprove = async (maPhongKham) => {
    if (!window.confirm("Xác nhận duyệt phòng khám này?")) return;
    const payload = {
        maPhongKham: maPhongKham,
        isApproved: true, 
        lyDoTuChoi: ""    
    };
    try {
      await browseClinicService.handleBrowseClinic(maPhongKham, payload);
      fetchClinics(); // Load lại bảng sau khi duyệt thành công
      alert("Đã phê duyệt phòng khám thành công!");
    } catch (error) {
      console.error("Lỗi duyệt phòng khám:", error);
      alert("Lỗi hệ thống khi phê duyệt!");
    }
  };

  // Hành động Từ chối
  const handleReject = async (maPhongKham) => {
    const reason = window.prompt("Vui lòng nhập lý do từ chối phòng khám này (Bắt buộc):");
    if (reason === null) return; 
    if (reason.trim() === "") {
        alert("Thao tác thất bại: Bạn bắt buộc phải nhập lý do từ chối!");
        return;
    }
    try {
      const payload = {
        maPhongKham: maPhongKham,
        isApproved: false, 
        lyDoTuChoi: reason.trim() 
      };
      await browseClinicService.handleBrowseClinic(maPhongKham, payload);
      fetchClinics();
      alert("Đã từ chối phòng khám thành công!"); 
    } catch (error) {
      console.error("Lỗi từ chối phòng khám:", error);
      alert("Lỗi hệ thống khi từ chối!");
    }
  };

  // Xem chi tiết
  const handleViewDetails = async (maPhongKham) => {
    try {
      // Gọi API lấy chi tiết để có dữ liệu đầy đủ nhất (Giấy phép, File đính kèm...)
      const detailData = await browseClinicService.detailBrowseClinic(maPhongKham);
      setSelectedRequest(detailData);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      // Fallback: Nếu API lỗi thì dùng tạm dữ liệu ở Table
      setSelectedRequest(maPhongKham);
      setShowDetailModal(true);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Duyệt yêu cầu đăng ký phòng khám</h1>
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, người đại diện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Lọc theo trạng thái:</span>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi đổi filter
            }}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option> {/* Sửa lại theo chuẩn Enum Backend nếu cần */}
            <option value="Đã từ chối">Đã từ chối</option>
          </select>
        </div>
      </div>

      {/* Hiển thị Loading */}
      {isLoading ? (
         <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
      ) : (
         <ClinicRequestTable
           requests={requests}
           onApprove={handleApprove}
           onReject={handleReject}
           onViewDetails={handleViewDetails}
           currentPage={currentPage}
           totalPages={totalPages}
           setCurrentPage={setCurrentPage}
         />
      )}

      {showDetailModal && selectedRequest && (
        <ClinicRequestDetails
          request={selectedRequest}
          onClose={() => setShowDetailModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default ClinicRequestManagement;