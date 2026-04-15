import React, { useCallback, useEffect, useState } from "react";
import styles from "./PatientManagement.module.css";
import axios from "axios";
import ReusableTable from "../../../../components/DoctorTable/ReusableTable";


const PatientManagement = () => {
  /*const [tenBien, hamDoiGiaTri] = useState(giaTriBanDau);*/
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/v1/patient/get-all", {
        params: { page: currentPage, size: pageSize, keyword: searchTerm },
      });
      setPatients(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Lỗi API:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]); //Dặn React: Chỉ tạo lại hàm này nếu page hoặc search thay đổi

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  // Cấu hình các cột hiển thị
  const columns = [
    { header: "Mã BN", render: (p) => p.maBenhNhan },
    {
      header: "Họ tên",
      render: (p) => (
        <div className={styles.patientNameCell}>
          <img src={p.taiKhoan?.anh || 'default-avatar.png'} alt="avatar" />
          <span>{p.taiKhoan?.hoVaTen || p.hoVaTen}</span>
        </div>
      )
    },
    { header: "Ngày Sinh", render: (p) => p.taiKhoan?.ngaySinh },
    { header: "Giới tính", render: (p) => p.taiKhoan?.gioiTinh ? "Nam" : "Nữ" },
    { header: "Số điện thoại", render: (p) => p.taiKhoan?.soDienThoai },
    { header: "Địa chỉ", render: (p) => p.taiKhoan?.diaChi },
    {
      header: "Thao tác",
      render: (p) => (
        <div className={styles.actionGroup}>
          <button className={styles.btnAction} title="Hồ sơ"><i className="fa-solid fa-file-invoice"></i></button>
          <button className={styles.btnAction} title="Nhắn tin"><i className="fa-solid fa-comment-dots"></i></button>
          <button className={styles.btnAction} title="Sửa"><i className="fa-solid fa-pen-to-square"></i></button>
          <button className={styles.btnAction} title="Xóa"><i className="fa-solid fa-trash"></i></button>
        </div>
      )
    }
  ];

  // Giao diện Bộ lọc
  const FilterUI = (
    <div className={styles.filterContainer}>
      <div className={styles.filterLeft}>
        <div className={styles.inputWrapper}>
          <input type="date" className={styles.inputDate} />
        </div>
        <div className={styles.inputWrapper}>
          <i className="fa-solid fa-filter"></i>
          <select className={styles.selectAge}><option>Ngày sinh</option></select>
        </div>
      </div>

      <div className={styles.filterRight}>
        <div className={styles.inputWrapper}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchBar}
          />
        </div>
        <button className={styles.btnAdd}>+ Thêm bệnh nhân</button>
      </div>
    </div>
  );

  // Giao diện Phân trang
  const PaginationUI = (
    <div className={styles.paginationFlex}>
      <span>Showing {patients.length} out of {totalPages * pageSize}</span>
      <div className={styles.pageButtons}>
        <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <span className={styles.pageCurrent}>{currentPage + 1}</span>
        <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );

  return (
    <ReusableTable
      columns={columns}
      data={patients}
      loading={loading}
      filterComponent={FilterUI}
      pagination={PaginationUI}
    />
  );
};

export default PatientManagement;