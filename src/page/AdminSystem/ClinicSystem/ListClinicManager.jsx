import React from "react";
import styles from "./ClinicManager.module.css"; 

const ClinicRequestTable = ({
  requests,
  onViewDetails,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã PK</th>
              <th>Tên phòng khám</th>
              <th>Người đại diện</th>
              <th>Loại hình phòng khám</th>
              <th>Địa chỉ</th>
              <th>Tỉnh,TP</th>
              <th>SL_BS</th>
              <th>Trạng thái</th>
              <th>Ngày đăng ký</th>
              <th>Mã Gói</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {requests && requests.length > 0 ? (
              requests.map((request) => {
                // Khớp chính xác với DTO BrowseClinicResponse
                const clinicId = request.maPhongKham; 
                
                return (
                <tr key={clinicId}>
                  <td><span className={styles.clinicId}>{clinicId}</span></td>
                  <td><div className={styles.clinicName}>{request.tenPhongKham}</div></td>
                  <td>{request.nguoiDaiDien}</td>
                  <td>{request.loaiHinhPhongKham}</td>
                  <td>
                    <div className={styles.address}>{request.diaChi}</div>
                  </td>
                  <td>{request.tinhThanhPho}</td>
                  <td>{request.soLuongBacSi || 0}</td>
                  <td>
                    <span style={{
                        fontWeight: 'bold', 
                        // Cập nhật màu sắc theo trạng thái mới
                        color: request.trangThai === 'Hoạt động' ? '#2ecc71' : // Màu xanh lá
                               request.trangThai === 'Ngừng hoạt động' ? '#e74c3c' :   // Màu đỏ
                               '#f39c12'                                       // Màu cam (cho các trạng thái khác nếu có)
                    }}>
                        {request.trangThai}
                    </span>
                  </td>
                  <td>{formatDate(request.ngayDangKy)}</td>
                  <td>{request.maGoi || "Chưa có"}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.viewButton}
                        onClick={() => onViewDetails(request)}
                        title="Xem chi tiết"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      
                      <button
                        className={styles.deleteButton}
                        onClick={() => onDelete(clinicId)}
                        title="Xóa phòng khám"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan="9" className={styles.noData}>
                  Không tìm thấy phòng khám nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className={styles.pagination}>
          <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
            <i className="fa-solid fa-square-caret-left"></i>
          </button>
          
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={currentPage === idx + 1 ? styles.activePage : ""}
              onClick={() => paginate(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          
          <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>
            <i className="fa-solid fa-square-caret-right"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default ClinicRequestTable;