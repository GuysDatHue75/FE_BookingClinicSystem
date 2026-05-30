import React, { useState, useEffect } from "react";
import styles from "./MNSpecialty.module.css";
import specialtyService from "../../../services/clinic/SpecialtyService";
import { toast } from "react-toastify";

const MNSpecialty = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State tìm kiếm real-time
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    trangThai: "", // Có thể lọc theo trạng thái nếu Backend hỗ trợ
  });

  // State quản lý Modal và Form
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialForm = {
    maChuyenKhoa: "",
    tenChuyenKhoa: "",
    moTa: "",
    trangThai: "true", // Select option thường dùng string, sẽ ép kiểu boolean khi gửi
  };
  const [formData, setFormData] = useState(initialForm);

  // 1. GỌI API LẤY DANH SÁCH & TÌM KIẾM
  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const maPK = localStorage.getItem("idPhongKham");
      if (!maPK) return;

      // Nếu Backend đã thiết kế hàm search nhận body là searchParams
      const res = await specialtyService.searchSpecialties(maPK, searchParams);
      setDepartments(res || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách chuyên khoa:", error);
      toast.error("Không thể tải danh sách chuyên khoa");
    } finally {
      setLoading(false);
    }
  };

  // Kích hoạt khi chuyển trang
  useEffect(() => {
    fetchSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Debounce Search 500ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchSpecialties();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. TẠO MỚI & CẬP NHẬT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const maPK = localStorage.getItem("idPhongKham");
    if (!maPK) return;

    // Chuẩn bị payload gửi xuống Backend (ép kiểu trangThai thành boolean)
    const payload = {
      ...formData,
      trangThai: formData.trangThai === "true"
    };

    try {
      if (isEditing) {
        await specialtyService.updateSpecialty(maPK, formData.maChuyenKhoa, payload);
        toast.success("Cập nhật chuyên khoa thành công");
      } else {
        await specialtyService.createSpecialty(maPK, payload);
        toast.success("Thêm mới chuyên khoa thành công");
      }
      closeModal();
      fetchSpecialties(); // Load lại bảng
    } catch (error) {
      console.error("Lỗi lưu chuyên khoa:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  // 3. XÓA CHUYÊN KHOA
  const deleteDepartment = async (maChuyenKhoa) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chuyên khoa này?")) {
      const maPK = localStorage.getItem("idPhongKham");
      try {
        await specialtyService.deleteSpecialty(maPK, maChuyenKhoa);
        toast.success("Đã xóa chuyên khoa");
        fetchSpecialties();
      } catch (error) {
        console.error("Lỗi xóa chuyên khoa:", error);
        toast.error("Xóa chuyên khoa thất bại");
      }
    }
  };

  // Các hàm điều khiển UI
  const openCreateModal = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setFormData({
      maChuyenKhoa: dept.maChuyenKhoa,
      tenChuyenKhoa: dept.tenChuyenKhoa,
      moTa: dept.moTa || "",
      trangThai: dept.trangThai ? "true" : "false",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialForm);
  };

  // Tính toán phân trang frontend
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = departments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Chuyên khoa</h1>
        <p className={styles.subtitle}>Quản lý thông tin các chuyên khoa trong phòng khám</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            name="keyword"
            placeholder="Tìm kiếm chuyên khoa..."
            value={searchParams.keyword}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

        <button className={styles.addButton} onClick={openCreateModal}>
          + Thêm chuyên khoa
        </button>
      </div>

      {/* MODAL THÊM / SỬA */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.formTitle}>
                {isEditing ? "Cập nhật chuyên khoa" : "Thêm chuyên khoa mới"}
              </h2>
              <button onClick={closeModal} className={styles.closeIconBtn}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                {/* <div className={styles.formGroup}>
                  <label className={styles.label}>Mã chuyên khoa *</label>
                  <input
                    type="text"
                    name="maChuyenKhoa"
                    value={formData.maChuyenKhoa}
                    onChange={handleInputChange}
                    className={`${styles.input} ${isEditing ? styles.readonly : ""}`}
                    readOnly={isEditing} // Không cho sửa mã khi edit
                    required
                    placeholder="VD: CK01"
                  />
                </div> */}

                <div className={styles.formGroup}>
                  <label className={styles.label}>Tên chuyên khoa *</label>
                  <input
                    type="text"
                    name="tenChuyenKhoa"
                    value={formData.tenChuyenKhoa}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Mô tả chuyên khoa</label>
                <textarea
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows="3"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Trạng thái</label>
                <select
                  name="trangThai"
                  value={formData.trangThai}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Tạm ngưng</option>
                </select>
              </div>

              <div className={styles.formButtons}>
                <button type="submit" className={styles.saveButton}>
                  {isEditing ? "Lưu cập nhật" : "Tạo mới"}
                </button>
                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BẢNG DANH SÁCH */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã CK</th>
              <th>Tên chuyên khoa</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className={styles.noData}>Đang tải dữ liệu...</td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((dept) => (
                <tr key={dept.maChuyenKhoa}>
                  <td className={styles.deptMeta}>{dept.maChuyenKhoa}</td>
                  <td>
                    <div className={styles.deptName}>{dept.tenChuyenKhoa}</div>
                  </td>
                  <td>{dept.moTa || "—"}</td>
                  <td>
                    <span className={`${styles.status} ${dept.trangThai ? styles.active : styles.inactive}`}>
                      {dept.trangThai ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editButton} onClick={() => openEditModal(dept)} title="Chỉnh sửa">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className={styles.deleteButton} onClick={() => deleteDepartment(dept.maChuyenKhoa)} title="Xóa">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.noData}>Không có dữ liệu chuyên khoa nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
            <i className="fa-solid fa-square-caret-left"></i>
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? styles.activePage : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
            <i className="fa-solid fa-square-caret-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default MNSpecialty;