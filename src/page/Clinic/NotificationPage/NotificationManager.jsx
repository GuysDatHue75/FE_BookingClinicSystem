import React, { useState, useEffect } from "react";
import NotificationTable from "./NotificationTable";
import NotificationFormModal from "./NotificationFormModal";
import NotificationDetailModal from "./NotificationDetailModal";
import styles from "./NotificationEditer.module.css";
import notificationService from "../../../services/clinic/NottificationService"; // Chú ý tên file NottificationService của bạn

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); 

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
  const [editingNotif, setEditingNotif] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const fetchUnreadCount = async () => {
    try {
      const maTK = localStorage.getItem("idAccount");
      if (maTK) {
        const res = await notificationService.getUnreadCount(maTK);
        setUnreadCount(res || 0);
      }
    } catch (error) {
      console.error("Lỗi lấy số thông báo chưa đọc:", error);
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const pageIndex = currentPage - 1;
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
        maTaiKhoan:  localStorage.getItem("idAccount"),
        page: pageIndex,
        size: size,
        sortBy: "thoiGianGui",
        sortDirection: "desc"
      };

      // 💥 GỌI API TÌM KIẾM THÔNG BÁO ĐÃ GỬI
      const response = await notificationService.searchSentNotifications(searchPayload); 
      const responseData = response || response.data ;
      
      setNotifications(responseData.content || []);
      setTotalPages(responseData.totalPages || 1);
      
      fetchUnreadCount(); 
    } catch (error) {
      console.error("Lỗi lấy danh sách thông báo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterType, filterTarget, fromDate, toDate]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchNotifications();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setEditingNotif(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (notif) => {
    setEditingNotif(notif);
    setShowFormModal(true);
  };

  const handleViewDetails = async (maThongBao) => {
    try {
      const response = await notificationService.detailNotification(maThongBao);
      const resultData = response.data || response;
      setDetailData(resultData);
      setShowDetailModal(true);

      const maTK = localStorage.getItem("idAccount");
      if (maTK) {
        await notificationService.markAsRead(maThongBao, maTK);
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết thông báo:", error);
      alert("Không thể tải chi tiết thông báo!");
    }
  };

  const handleDeleteNotification = async (maThongBao) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này không? Hành động này không thể hoàn tác.")) {
      try {
        await notificationService.deleteNotification(maThongBao);
        alert("Xóa thông báo thành công!");
        
        // Đóng modal chi tiết nếu nó đang được mở
        if (showDetailModal) {
          setShowDetailModal(false);
        }
        
        // Tải lại danh sách thông báo
        fetchNotifications();
      } catch (error) {
        console.error("Lỗi khi xóa thông báo:", error);
        alert("Xóa thông báo thất bại, vui lòng thử lại!");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className={styles.title} style={{ margin: 0 }}>Quản lý thông báo</h1>
        {/* {unreadCount > 0 && (
          <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
            <i className="fa-solid fa-bell"></i> Bạn có {unreadCount} thông báo mới
          </div>
        )} */}
        <button className={styles.createBtn} onClick={handleOpenCreate}>
            <i className="fa-solid fa-bullhorn"></i> Viết thông báo
        </button>
      </div>
      
      <div className={styles.controlsPanel}>
        <div className={styles.searchRow}>
          <div className={styles.searchContainer}>
            <input
              type="text" placeholder="Tìm kiếm theo mã, tiêu đề..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}><i className="fa-solid fa-magnifying-glass"></i></span>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={styles.filterSelect}>
            <option value="all">Tất cả loại thông báo</option>
            <option value="Bảo trì">Bảo trì</option>
            <option value="Cập nhật">Cập nhật hệ thống</option>
            <option value="Khuyến mãi">Khuyến mãi</option>
            <option value="Thông tin">Thông tin</option>
          </select>

          <select value={filterTarget} onChange={(e) => setFilterTarget(e.target.value)} className={styles.filterSelect}>
            <option value="all">Tất cả người nhận</option>
            <option value="BacSi">Bác sĩ</option>
            <option value="BenhNhan">Bệnh nhân</option>
          </select>

          <span className={styles.filterLabel} style={{marginLeft: '10px'}}>Từ:</span>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={styles.filterDate} />
          
          <span className={styles.filterLabel}>Đến:</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={styles.filterDate} />
        </div>
      </div>

      {isLoading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
      ) : (
        <NotificationTable
          data={notifications}
          onView={handleViewDetails}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteNotification}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {showDetailModal && detailData && (
        <NotificationDetailModal 
          data={detailData} 
          onClose={() => setShowDetailModal(false)} 
          onDelete={handleDeleteNotification}
        />
      )}

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