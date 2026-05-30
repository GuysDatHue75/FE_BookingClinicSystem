import React from "react";
import styles from "./NotificationEditer.module.css";

const NotificationTable = ({ data, onView, onEdit, onDelete, currentPage, totalPages, setCurrentPage }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã thông báo</th>
              <th>Tiêu đề / Tên thông báo</th>
              <th>Người viết</th>
              <th>Loại thông báo</th>
              <th>Đối tượng nhận</th>
              <th>Ngày gửi</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.maThongBao || Math.random()}>
                  <td style={{color: '#7f8c8d'}}>{item.maThongBao}</td>
                  <td style={{fontWeight: 'bold', color: '#2c3e50'}}>{item.tieuDe}</td>
                  <td>{item.maTaiKhoan || "Hệ thống"}</td>
                  <td>{item.loaiThongBao}</td>
                  <td>{item.doiTuongNhan}</td>
                  <td>{formatDate(item.thoiGianGui)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.btnView}`} onClick={() => onView(item.maThongBao)} title="Xem chi tiết">
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className={`${styles.actionBtn} ${styles.btnEdit}`} onClick={() => onEdit(item)} title="Chỉnh sửa">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={() => onDelete(item.maThongBao)} title="Xóa" >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#7f8c8d'}}>
                  Không tìm thấy thông báo nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div style={{display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '15px'}}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => paginate(currentPage - 1)}
            style={{padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc'}}
          >
            <i className="fa-solid fa-caret-left"></i>
          </button>
          
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => paginate(idx + 1)}
              style={{
                padding: '5px 12px', cursor: 'pointer', borderRadius: '4px',
                border: currentPage === idx + 1 ? 'none' : '1px solid #ccc',
                backgroundColor: currentPage === idx + 1 ? '#3b82f6' : '#fff',
                color: currentPage === idx + 1 ? '#fff' : '#000'
              }}
            >
              {idx + 1}
            </button>
          ))}
          
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => paginate(currentPage + 1)}
            style={{padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc'}}
          >
             <i className="fa-solid fa-caret-right"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default NotificationTable;