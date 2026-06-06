import React from "react";
import styles from "./AccountManager.module.css";

const AccountTable = ({ data, onView, onEdit, onDelete, currentPage, totalPages, setCurrentPage }) => {
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getRoleLabel = (role) => {
    switch(role) {
      case 'Admin': return <span style={{color: '#e74c3c', fontWeight: 'bold'}}>Admin</span>;
      case 'PhongKham': return <span style={{color: '#9b59b6', fontWeight: 'bold'}}>Phòng Khám</span>;
      case 'BacSi': return <span style={{color: '#3498db', fontWeight: 'bold'}}>Bác Sĩ</span>;
      case 'BenhNhan': return <span style={{color: '#2ecc71', fontWeight: 'bold'}}>Bệnh Nhân</span>;
      default: return role;
    }
  };

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã TK</th>
              <th>Họ và Tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.maTaiKhoan}>
                  <td style={{color: '#7f8c8d'}}>{item.maTaiKhoan}</td>
                  <td style={{fontWeight: 'bold', color: '#2c3e50'}}>{item.hoVaTen}</td>
                  <td>{item.soDt}</td>
                  <td>{item.email || "N/A"}</td>
                  <td>{getRoleLabel(item.vaiTro)}</td>
                  <td>
                    {item.trangThai ? (
                      <span style={{color: '#27ae60', backgroundColor: '#eafaf1', padding: '4px 8px', borderRadius: '4px'}}>Hoạt động</span>
                    ) : (
                      <span style={{color: '#c0392b', backgroundColor: '#fdedec', padding: '4px 8px', borderRadius: '4px'}}>Đã khóa</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.btnView}`} onClick={() => onView(item.maTaiKhoan)} title="Xem chi tiết">
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className={`${styles.actionBtn} ${styles.btnEdit}`} onClick={() => onEdit(item)} title="Chỉnh sửa">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={() => onDelete(item.maTaiKhoan)} title="Khóa/Xóa">
                        <i className="fa-solid fa-lock"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#7f8c8d'}}>
                  Không tìm thấy tài khoản nào phù hợp.
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

export default AccountTable;