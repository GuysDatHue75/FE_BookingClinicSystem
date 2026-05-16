import React from "react";
import styles from "./ClinicTable.module.css";

const ClinicRequestTable = ({
  requests,
  onApprove,
  onReject,
  onViewDetails,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusText = (status) => {
    // Ép kiểu về lowercase để so sánh chuẩn xác với DB
    switch (status?.toLowerCase()) {
      case "pending": return "Chờ duyệt";
      case "approved": return "Đã duyệt";
      case "rejected": return "Đã từ chối";
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return styles.statusPending;
      case "approved": return styles.statusApproved;
      case "rejected": return styles.statusRejected;
      default: return "";
    }
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
              <th>Số lượng BS</th>
              <th>Trạng thái</th>
              <th>Ngày đăng ký</th>
              <th>Mã Gói</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {requests && requests.length > 0 ? (
              requests.map((request) => {
                // Ưu tiên dùng maPhongKham từ Backend, nếu không có fallback về id
                const clinicId = request.maPhongKham || request.id; 

                return (
                <tr key={clinicId}>
                  <td>
                    <span className={styles.clinicId}>{clinicId}</span>
                  </td>
                  <td>
                    <div className={styles.clinicName}>{request.tenPhongKham}</div>
                  </td>
                  <td>{request.nguoiDaiDien}</td>
                  <td>{request.loaiHinhPhongKham}</td>
                  <td>
                    <div className={styles.address}>{request.diaChi}</div>
                  </td>
                  <td>{request.tinhThanhPho}</td>
                  <td>{request.soLuongBacSi}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(request.trangThai)}`}>
                      {getStatusText(request.trangThai)}
                    </span>
                  </td>
                  <td>{formatDate(request.ngayDangKy)}</td>
                  <td>{request.maGoi}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.viewButton}
                        onClick={() => onViewDetails(request)}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      
                      {/* Chỉ hiện nút duyệt/từ chối khi trạng thái là pending */}
                      {request.status?.toLowerCase() === "pending" && (
                        <>
                          <button
                            className={styles.approveButton}
                            onClick={() => onApprove(clinicId)}
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button
                            className={styles.rejectButton}
                            onClick={() => onReject(clinicId)}
                          >
                            <i className="fa-solid fa-square-xmark"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan="7" className={styles.noData}>
                  Không có yêu cầu đăng ký nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RENDER PHÂN TRANG THEO TỔNG SỐ TRANG TỪ BACKEND */}
      {totalPages > 0 && (
          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
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

            <button
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <i className="fa-solid fa-square-caret-right"></i>
            </button>
          </div>
      )}
    </>
  );
};

export default ClinicRequestTable;