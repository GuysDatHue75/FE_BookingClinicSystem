import React, { useCallback, useEffect, useState } from "react";
import styles from "./PatientManagement.module.css";
import axios from "axios";
import ReusableTable from "../../../../components/DoctorTable/ReusableTable";
import ConfirmModal from "../../../../components/ConfirmModal/ConfirmModal";
import apiClient from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const PatientManagement = () => {
  /*const [tenBien, hamDoiGiaTri] = useState(giaTriBanDau);*/
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientIdToDelete, setPatientIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const idDoctor = localStorage.getItem("idDoctor");
  const idClinic = JSON.parse(localStorage.getItem("user")).phongKham.maPhongKham;
  const pageSize = 5;

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/v1/patient/get-all?page=${currentPage}&size=${pageSize}&maBacSi=${idDoctor}&maPhongKham=${idClinic}&keyword=${searchTerm}`);
      setPatients(response.data.content || []);
      console.log(response.data);
      
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Lỗi API:", error);
    } finally {
      setLoading(false);
    }

  }, [currentPage, searchTerm, idDoctor, idClinic]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };
  const handleDeleteClick = (id) => {
    setPatientIdToDelete(id);
    setIsDeleteModalOpen(true);
  }
  const navigate = useNavigate();


  const handleConfirmDelete = async () => {
    try {
      const response = await apiClient.delete(`/api/v1/patient/delete/${patientIdToDelete}`);
      toast.success(response.data || "Xóa bệnh nhân thành công!");
      setIsDeleteModalOpen(false);
      fetchPatients();
    } catch (error) {
      toast.error(error.response?.data || "Lỗi khi xóa bệnh nhân");
    }
  }
  // Cấu hình các cột hiển thị
  const columns = [
    { header: "Mã BN", render: (p) => p.maBenhNhan },
    {
      header: "Họ tên",
      render: (p) => (
        <div className={styles.patientNameCell}>

          <img src={p?.avatar || 'default-avatar.png'} alt="avatar" />
          <span>{p.taiKhoan?.hoVaTen || p.hoVaTen}</span>
        </div>
      )
    },
    { header: "Ngày Sinh", render: (p) => p.ngaySinh },

    { header: "Giới tính", render: (p) => p.taiKhoan?.gioiTinh ? "Nam" : "Nữ" },
    { header: "Số điện thoại", render: (p) => p.soDienThoai },
    { header: "Địa chỉ", render: (p) => p.diaChi },
    {
      header: "Thao tác",
      render: (p) => (
        <div className={styles.actionGroup}>

          <button className={styles.btnAction} title="Hồ sơ" onClick={() => navigate(`/doctor/patient-detail/${p.maBenhNhan}`)}><i className="fa-solid fa-file-invoice"></i></button>
          <button
            className={styles.btnAction}
            title="Nhắn tin"
            onClick={() => navigate(`/doctor/chat`, {
              state: {
                targetPatient: {
                  maBenhNhan: p.maBenhNhan,
                  hoVaTen: p.taiKhoan?.hoVaTen || p.hoVaTen,
                  avatar: p.taiKhoan?.anh || p.anhDaiDien
                }
              }
            })}
          >
            <i className="fa-solid fa-comments"></i>
          </button>
          <button className={styles.btnAction} title="Sửa" onClick={() => navigate(`/doctor/patient-detail/${p.maBenhNhan}`)}><i className="fa-solid fa-pen-to-square"></i></button>
          <button className={styles.btnAction} title="Xóa" onClick={() => handleDeleteClick(p.maBenhNhan)}>
            <i className="fa-solid fa-trash"></i>
          </button>

        </div>
      )
    }
  ];

  // Giao diện Bộ lọc
  const FilterUI = (
    <div className={styles.filterContainer}>
      {/* <div className={styles.filterLeft}>
        <div className={styles.inputWrapper}>
          <input type="date" className={styles.inputDate} />
        </div>
        <div className={styles.inputWrapper}>
          <i className="fa-solid fa-filter"></i>
          <select className={styles.selectAge}><option>Ngày sinh</option></select>
        </div>
      </div> */}

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

      </div>
    </div>
  );

  return (

    <>
      {/* Component Bảng của sếp */}
      <ReusableTable
        columns={columns}
        data={patients}
        loading={loading}
        filterComponent={FilterUI}
        pagination={PaginationUI}
      />

      {/*THÊM CỤC NÀY VÀO ĐÂY THÌ NÓ MỚI HIỆN POPUP ĐƯỢC --- */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        // Custom câu thông báo động theo mã bệnh nhân đang chọn
        message={`Bạn có chắc chắn muốn xóa bệnh nhân mã ${patientIdToDelete}? Dữ liệu sẽ không thể khôi phục.`}
      />
    </>
  );
};

export default PatientManagement;