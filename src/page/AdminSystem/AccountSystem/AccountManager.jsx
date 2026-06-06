import React, { useState, useEffect } from "react";
import AccountTable from "./AccountTable";
import AccountFormModal from "./AccountFormModal";
import AccountDetailModal from "./AccountDetailModal";
import styles from "./AccountManager.module.css"; 
import accountService from "../../../services/admin/AccountService";

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // States Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // States Modal & Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null); 

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const pageIndex = currentPage - 1;

      const searchPayload = {
        keyword: searchTerm ? searchTerm.trim() : null,
        vaiTro: filterRole === "all" ? null : filterRole,
        page: pageIndex,
        size: size,
      };

      const responseData = await accountService.searchAccounts(searchPayload);
      
      setAccounts(responseData.content || []);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Lỗi lấy danh sách tài khoản:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [currentPage, filterRole]);

  // Debounce cho thanh tìm kiếm
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchAccounts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setEditingAccount(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (account) => {
    setEditingAccount(account);
    setShowFormModal(true);
  };

  const handleDelete = async (maTaiKhoan) => {
    if (!window.confirm("Bạn có chắc chắn muốn khóa/xóa tài khoản này?")) return;
    try {
      await accountService.deleteAccount(maTaiKhoan);
      alert("Xóa tài khoản thành công!");
      fetchAccounts();
    } catch (error) {
      console.error("Lỗi xóa tài khoản:", error);
      alert("Có lỗi xảy ra khi xóa tài khoản!");
    }
  };

  const handleViewDetails = async (maTaiKhoan) => {
    try {
      const detailData = await accountService.getAccountDetail(maTaiKhoan);
      setDetailData(detailData);
      setShowDetailModal(true);
    } catch (error) {
        console.error("Lỗi lấy chi tiết tài khoản:", error);
        alert("Không thể tải chi tiết tài khoản!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý tài khoản</h1>
      
      <div className={styles.controlsPanel}>
        <div className={styles.searchRow}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên, SĐT, Email..."
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
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className={styles.filterSelect}>
            <option value="all">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="PhongKham">Phòng Khám</option>
            <option value="BacSi">Bác Sĩ</option>
            <option value="BenhNhan">Bệnh Nhân</option>
          </select>

          <button className={styles.createBtn} onClick={handleOpenCreate}>
            <i className="fa-solid fa-user-plus"></i> Tạo tài khoản
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
      ) : (
        <AccountTable
          data={accounts}
          onView={handleViewDetails}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {showDetailModal && detailData && (
        <AccountDetailModal 
          data={detailData} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}

      {showFormModal && (
        <AccountFormModal
          initialData={editingAccount}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            setShowFormModal(false);
            fetchAccounts();
          }}
        />
      )}
    </div>
  );
};

export default AccountManager;