import React from "react";
import styles from "./NewsEditor.module.css";

const NewsTable = ({ data, onView, onEdit, onDelete, currentPage, totalPages, setCurrentPage }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className={styles.mainContent}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ borderBottom: '2px solid #eee' }}>
          <tr>
            <th style={{ padding: '12px' }}>Mã TT</th>
            <th style={{ padding: '12px' }}>Tiêu đề</th>
            <th style={{ padding: '12px' }}>Ngày tạo</th>
            <th style={{ padding: '12px' }}>Ngày cập nhật</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.maTinTuc} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', color: '#7f8c8d' }}>{item.maTinTuc}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.tieuDe}</td>
                <td style={{ padding: '12px' }}>{formatDate(item.ngayTao)}</td>
                <td style={{ padding: '12px' }}>{formatDate(item.ngayCapNhat)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => onView(item.maTinTuc)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3498db', fontSize: '16px', margin: '0 5px' }}><i className="fa-solid fa-eye"></i></button>
                  <button onClick={() => onEdit(item.maTinTuc)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#f39c12', fontSize: '16px', margin: '0 5px' }}><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => onDelete(item.maTinTuc)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '16px', margin: '0 5px' }}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không có tin tức nào.</td></tr>
          )}
        </tbody>
      </table>

      {totalPages > 0 && (
        <div style={{display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px'}}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={{padding: '5px 10px'}}><i className="fa-solid fa-caret-left"></i></button>
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx + 1} onClick={() => setCurrentPage(idx + 1)} style={{ padding: '5px 12px', backgroundColor: currentPage === idx + 1 ? '#3498db' : '#fff', color: currentPage === idx + 1 ? '#fff' : '#000', border: '1px solid #ccc' }}>
              {idx + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} style={{padding: '5px 10px'}}><i className="fa-solid fa-caret-right"></i></button>
        </div>
      )}
    </div>
  );
};

export default NewsTable;