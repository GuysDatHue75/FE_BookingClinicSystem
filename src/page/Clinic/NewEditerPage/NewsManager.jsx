import React, { useState, useEffect } from "react";
import NewsTable from "./NewsTable";
import NewsFormModal from "./NewsFormModal";
import NewsDetailModal from "./NewsDetailModal";
import newsService from "../../../services/clinic/NewsService"; // Đảm bảo đường dẫn đúng
import styles from "./NewsEditor.module.css"; // Dùng chung file CSS

const NewsManager = () => {
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // States Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // States Phân trang & Modal
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const idPhongKham = localStorage.getItem("idPhongKham");

  const fetchNews = async () => {
    if (!idPhongKham) return;
    setIsLoading(true);
    try {
      const formatDateTime = (date, isEndOfDay) => {
        if (!date) return null;
        return isEndOfDay ? `${date}T23:59:59` : `${date}T00:00:00`;
      };

      const searchPayload = {
        keyword: searchTerm ? searchTerm.trim() : null,
        fromDate: formatDateTime(fromDate, false),
        toDate: formatDateTime(toDate, true),
        page: currentPage - 1,
        size: size,
        sortBy: "ngayCapNhat",
        sortDirection: "desc"
      };

      const response = await newsService.searchNews(idPhongKham, searchPayload);
      const responseData = response.data || response;
      
      setNewsList(responseData.content || []);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Lỗi lấy danh sách tin tức:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, fromDate, toDate]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchNews();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setEditingNews(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = async (maTinTuc) => {
    try {
      const response = await newsService.getDetail(idPhongKham, maTinTuc);
      setEditingNews(response.data || response);
      setShowFormModal(true);
    } catch (error) {
      alert("Không thể tải thông tin để sửa!");
    }
  };

  const handleViewDetails = async (maTinTuc) => {
    try {
      const response = await newsService.getDetail(idPhongKham, maTinTuc);
      setDetailData(response.data || response);
      setShowDetailModal(true);
    } catch (error) {
      alert("Không thể tải chi tiết tin tức!");
    }
  };

  const handleDelete = async (maTinTuc) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin tức này?")) {
      try {
        await newsService.deleteNews(idPhongKham, maTinTuc);
        alert("Xóa thành công!");
        setShowDetailModal(false);
        fetchNews();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className={styles.title} style={{ margin: 0 }}>Quản lý tin tức</h1>
        <button className={styles.publishButton} style={{ width: 'auto', padding: '10px 20px', margin: 0 }} onClick={handleOpenCreate}>
          + Viết tin tức mới
        </button>
      </div>
      
      <div className={styles.sidebarSection} style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', padding: '15px' }}>
        <div className={styles.searchContainer}>
        <input
          type="text" placeholder="Tìm kiếm tiêu đề, nội dung..."
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}><i className="fa-solid fa-magnifying-glass"></i></span>
        </div>
        <div className={styles.filterGroup}>
          <span>Từ ngày:</span>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={styles.select} style={{ width: 'auto' }}/>
          <span>Đến ngày:</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={styles.select} style={{ width: 'auto' }}/>
        </div>
      </div>

      {isLoading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
      ) : (
        <NewsTable
          data={newsList}
          onView={handleViewDetails}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {showDetailModal && detailData && (
        <NewsDetailModal 
          data={detailData} 
          onClose={() => setShowDetailModal(false)} 
          onDelete={handleDelete}
        />
      )}

      {showFormModal && (
        <NewsFormModal
          initialData={editingNews}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            setShowFormModal(false);
            fetchNews();
          }}
        />
      )}
    </div>
  );
};

export default NewsManager;