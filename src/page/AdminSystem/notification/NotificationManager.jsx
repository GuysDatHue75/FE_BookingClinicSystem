import React, { useState, useEffect } from "react";
import NotificationTable from "./NotificationTable";
import NotificationFormModal from "./NotificationFormModal";
import NotificationDetailModal from "./NotificationDetailModal";
import styles from "./NotificationManager.module.css";
import notificationService from "../../../services/admin/NotificationService";

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // States Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterTarget, setFilterTarget] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // States Modal & Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null); // null = Create, object = Edit

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // 1. GỌI API TÌM KIẾM
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const pageIndex = currentPage - 1;

      // Xử lý LocalDateTime cho Spring Boot
      const formatDateTime = (date, isEndOfDay) => {
        if (!date) return null;
        return isEndOfDay ? `${date}T23:59:59` : `${date}T00:00:00`;
      };

      const searchPayload = {
        keyword: searchTerm ? searchTerm.trim() : null,
        loaiThongBao: filterType === "all" ? null : filterType,
        doiTuongNhan: filterTarget === "all" ? null : filterTarget,
        fromDate: formatDateTime(fromDate, false),
        toDate: formatDateTime(toDate, true),
        isRead: null,
        maTaiKhoan: null,
        page: pageIndex,
        size: size,
        sortBy: "thoiGianGui",
        sortDirection: "desc"
      };

      const response = await notificationService.searchNotification(searchPayload);
      const responseData = response.data || response;
      
      setNotifications(responseData.content || []);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Lỗi lấy danh sách thông báo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, filterType, filterTarget, fromDate, toDate]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchNotifications();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setEditingNotif(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (notif) => {
    setEditingNotif(notif);
    setShowFormModal(true);
  };

  const handleDelete = async (maThongBao) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    try {
      await notificationService.deleteNotification(maThongBao);
      alert("Xóa thông báo thành công!");
      fetchNotifications();
    } catch (error) {
      console.error("Lỗi xóa thông báo:", error);
      alert("Có lỗi xảy ra khi xóa!");
    }
  };

  const handleViewDetails = async (maThongBao) => {
    try {
      const response = await notificationService.detailNotification(maThongBao);
      const resultData = response.data || response;
    
      setDetailData(resultData);
      setShowDetailModal(true);
    } catch (error) {
        console.error("Lỗi lấy chi tiết thông báo:", error);
        alert("Không thể tải chi tiết thông báo!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý thông báo</h1>
      
      {/* KHU VỰC ĐIỀU KHIỂN & LỌC */}
      <div className={styles.controlsPanel}>
        <div className={styles.searchRow}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tiêu đề, người viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={styles.filterSelect}>
            <option value="all">Tất cả loại thông báo</option>
            <option value="Bảo trì">Bảo trì</option>
            <option value="Cập nhật">Cập nhật hệ thống</option>
            <option value="Khuyến mãi">Khuyến mãi</option>
          </select>

          {/* <span className={styles.filterLabel} style={{marginLeft: '10px'}}>Đối tượng:</span> */}
          <select value={filterTarget} onChange={(e) => setFilterTarget(e.target.value)} className={styles.filterSelect}>
            <option value="all">Tất cả người dùng</option>
            <option value="BacSi">Bác sĩ</option>
            <option value="BenNhan">Bệnh nhân</option>
            <option value="PhongKham">Phòng khám</option>
          </select>

          <span className={styles.filterLabel} style={{marginLeft: '10px'}}>Từ:</span>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={styles.filterDate} />
          
          <span className={styles.filterLabel}>Đến:</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={styles.filterDate} />
          <button className={styles.createBtn} onClick={handleOpenCreate}>
                <i className="fa-solid fa-bullhorn"></i> Viết thông báo
            </button>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      {isLoading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
      ) : (
        <NotificationTable
          data={notifications}
          onView={handleViewDetails}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {showDetailModal && detailData && (
        <NotificationDetailModal 
          data={detailData} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}

      {/* MODAL THÊM / SỬA */}
      {showFormModal && (
        <NotificationFormModal
          initialData={editingNotif}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            setShowFormModal(false);
            fetchNotifications();
          }}
        />
      )}
    </div>
  );
};

export default NotificationManager;