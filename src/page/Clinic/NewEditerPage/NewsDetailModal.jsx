import React from "react";
import styles from "./NewsEditor.module.css";

const NewsDetailModal = ({ data, onClose, onDelete }) => {
  if (!data) return null;

  const IMAGE_BASE_URL = "http://localhost:8080";
  const getMediaUrl = (media) => {
    if (!media) return null;
    if (media.startsWith("http") || media.startsWith("data:image")) return media;
    return media.startsWith("/") ? `${IMAGE_BASE_URL}${media}` : `${IMAGE_BASE_URL}/${media}`;
  };

  const imgUrl = getMediaUrl(data.anh);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div className={styles.mainContent} style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Chi tiết tin tức</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        
        <div>
          <h1 style={{ color: '#2c3e50', fontSize: '24px' }}>{data.tieuDe}</h1>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Mã TT: {data.maTinTuc} | Cập nhật: {new Date(data.ngayCapNhat || data.ngayTao).toLocaleString("vi-VN")}</p>

          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
            {data.moTaNgan}
          </div>

          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {data.noiDung}
          </div>

          {imgUrl && (
            <div style={{ margin: '20px 0', textAlign: 'center' }}>
              <img src={imgUrl} alt="Thumbnail" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button onClick={() => onDelete(data.maTinTuc)} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            <i className="fa-solid fa-trash"></i> Xóa tin tức
          </button>
          <button onClick={onClose} className={styles.cancelButton} style={{ width: 'auto', padding: '10px 20px', margin: 0 }}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;