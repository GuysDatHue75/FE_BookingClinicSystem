import React, { useEffect, useState } from "react";
import styles from "./MNDoctorAll.module.css";
import doctorService from "../../../services/clinic/DoctorService";
import specialtyService from "../../../services/clinic/SpecialtyService"; 
import { toast } from "react-toastify";

// 💥 IMPORT 2 COMPONENT CỬA SỔ (Sửa lại đường dẫn nếu file của bạn nằm ở thư mục khác)
import CreateDoctor from "../CreateDoctorPage/CreateDoctor";
import DoctorView from "../DoctorViewPage/DoctorView";

const MNDoctorAll = () => {
  const [dataDoctor, setDataDoctor] = useState([]);
  const [specialties, setSpecialties] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // 💥 STATE QUẢN LÝ CỬA SỔ (MODAL)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewDoctorId, setViewDoctorId] = useState(null); // Lưu ID bác sĩ đang xem, null nghĩa là đang đóng

  const [searchParams, setSearchParams] = useState({
    keyword: "", 
    maChuyenKhoa: "", 
    chucVu: "",
    hocHam: "",
    tuNgay: "",
    denNgay: "",
  });

  const columns = [
    { name: "STT" },
    { name: "Họ và tên" },
    { name: "Giới tính" },
    { name: "Số điện thoại" },
    { name: "Email" },
    { name: "Địa chỉ" },
    { name: "Tên chuyên khoa" },
    { name: "Học hàm" },
    { name: "Ngày đăng ký" },
    { name: "Thao tác" },
  ];

  const fetchInitialData = async () => {
    const maPK = localStorage.getItem("idPhongKham");
    if (!maPK) return;
    try {
      const resSpecialties = await specialtyService.getAllSpecialties(maPK);
      setSpecialties(resSpecialties || []);
    } catch (error) {
      console.error("Lỗi tải chuyên khoa:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const maPK = localStorage.getItem("idPhongKham");
      if (maPK) {
        const payload = {
          keyword: searchParams.keyword,
          maChuyenKhoa: searchParams.maChuyenKhoa,
          chucVu: searchParams.chucVu,
          hocHam: searchParams.hocHam,
          fromDate: searchParams.tuNgay ? `${searchParams.tuNgay}T00:00:00` : null, 
          toDate: searchParams.denNgay ? `${searchParams.denNgay}T23:59:59` : null
        };
        const res = await doctorService.searchDoctors(maPK, payload);
        setDataDoctor(res || []);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách bác sĩ:", error);
      toast.error("Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1); 
      } else {
        fetchDoctors();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này khỏi phòng khám?")) {
      try {
        await doctorService.deleteDoctor(id);
        toast.success("Đã xóa bác sĩ thành công");
        setDataDoctor((prev) => prev.filter((doctor) => doctor.maBacSi !== id));
        // Nếu đang mở cửa sổ xem chi tiết của chính bác sĩ này thì đóng lại
        if (viewDoctorId === id) setViewDoctorId(null); 
      } catch (error) {
        console.error("Lỗi khi xóa bác sĩ:", error);
        toast.error("Xóa bác sĩ thất bại");
      }
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = dataDoctor.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(dataDoctor.length / itemsPerPage);

  return (
    <div className={styles.container}>
      {/* KHU VỰC TÌM KIẾM & BẢNG (Giữ nguyên như cũ) */}
      <div className={styles.topSection}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Danh sách bác sĩ</h2>
          <button className={styles.btnAdd} onClick={() => setShowCreateModal(true)}>
            + Thêm bác sĩ mới
          </button>
        </div>

        <div className={styles.searchFilterBox}>
          <div className={styles.searchRow}>
            <div className={styles.searchInputWrap}>
              <span className={styles.searchIcon}><i className="fa-solid fa-magnifying-glass"></i></span>
              <input type="text" name="keyword" placeholder="Tìm kiếm theo tên bác sĩ, số điện thoại hoặc địa chỉ...." value={searchParams.keyword} onChange={handleSearchChange} className={styles.searchInput} />
            </div>
            
            <div className={styles.filterGroup}>
              <select name="maChuyenKhoa" value={searchParams.maChuyenKhoa} onChange={handleSearchChange}>
                <option value="">-- Chuyên khoa --</option>
                {specialties.map((sp) => (
                  <option key={sp.maChuyenKhoa} value={sp.maChuyenKhoa}>{sp.tenChuyenKhoa}</option>
                ))}
              </select>

              <select name="hocHam" value={searchParams.hocHam} onChange={handleSearchChange}>
                <option value="">-- Học hàm --</option>
                <option value="Giáo sư">Giáo sư</option>
                <option value="Phó giáo sư">Phó giáo sư</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
              </select>

              <div className={styles.dateRow}>
                <div className={styles.dateGroup}>
                <label>Từ:</label>
                <input type="date" name="tuNgay" value={searchParams.tuNgay} onChange={handleSearchChange} />
                <label>Đến:</label>
                <input type="date" name="denNgay" value={searchParams.denNgay} onChange={handleSearchChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>{columns.map((column, index) => (<th key={index}>{column.name}</th>))}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" style={{ textAlign: "center", padding: "30px" }}>Đang tải dữ liệu...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((data, idx) => (
                <tr key={data.maBacSi}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td style={{ textAlign: "left", paddingLeft: "10px" }}>{data.tenBacSi}</td>
                  <td>{data.gioiTinh ? "Nam" : "Nữ"}</td>
                  <td>{data.soDienThoai}</td>
                  <td>{data.email}</td>
                  <td>{data.diaChi || "—"}</td>
                  <td>{data.tenChuyenKhoa || "—"}</td>
                  <td>{data.hocHam || "—"}</td>
                  <td>{data.ngayDangKy ? data.ngayDangKy.split('T')[0] : "—"}</td>
                  <td>
                    <div className={styles.actionIcons}>
                      {/* BẤM NÚT NÀY SẼ SET ID ĐỂ MỞ POPUP */}
                      <button className={styles.btnView} onClick={() => setViewDoctorId(data.maBacSi)} title="Xem chi tiết">
                        <i className="fa-solid fa-sliders"></i>
                      </button>
                      <button className={styles.btnDelete} onClick={() => handleDeleteDoctor(data.maBacSi)} title="Xóa bác sĩ">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="10" style={{ textAlign: "center", padding: "30px" }}>Không tìm thấy bác sĩ nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtnNav} disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}><i className="fa-solid fa-caret-left"></i></button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ""}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
          ))}
          <button className={styles.pageBtnNav} disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}><i className="fa-solid fa-caret-right"></i></button>
        </div>
      )}

      {/* 💥 KHU VỰC HIỂN THỊ CỬA SỔ (MODAL) */}
      
      {showCreateModal && (
        <CreateDoctor 
          onClose={() => setShowCreateModal(false)} 
          onRefresh={fetchDoctors} // Truyền hàm để tải lại bảng sau khi tạo thành công
        />
      )}

      {viewDoctorId && (
        <DoctorView 
          maBacSi={viewDoctorId} 
          onClose={() => setViewDoctorId(null)} 
          onDelete={() => handleDeleteDoctor(viewDoctorId)} // Cho phép xóa ngay trong Modal
        />
      )}

    </div>
  );
};

export default MNDoctorAll;