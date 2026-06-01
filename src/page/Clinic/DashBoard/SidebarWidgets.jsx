import React from 'react';
import styles from './Dashboard.module.css';

const SidebarWidgets = ({ heatmap, recentReview }) => {
  const heatmapColors = ['#e0f2fe', '#bae6fd', '#38bdf8', '#0ea5e9'];
  
  // Hàm phụ trợ tạo sao đánh giá
  const renderStars = (rating) => {
    const validRating = rating || 5; 
    return '★'.repeat(validRating) + '☆'.repeat(5 - validRating);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Giờ cao điểm lịch hẹn</div>
        <div className={styles.heatmapGrid}>
           {/* Giữ nguyên phần mockup Heatmap của bạn ở đây, 
               hoặc dùng vòng lặp render từ props `heatmap` nếu BackEnd cấu trúc mảng 2 chiều */}
          <div></div><div>8h</div><div>10h</div><div>12h</div><div>14h</div><div>16h</div>
          <div>T2</div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[2]}}></div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[3]}}></div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[3]}}></div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[1]}}></div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[0]}}></div>
        </div>
      </div>

      {/* RECENT REVIEW */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center'}}>
          <div className={styles.cardTitle} style={{margin: 0}}>Recent</div>
          <div style={{fontSize: '14px', fontWeight: 600, color: '#1a1a1a'}}>
            {recentReview?.reviewerName || 'Bệnh nhân'}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
           <div style={{color: '#38bdf8', fontSize: '14px', letterSpacing: '2px'}}>
             {renderStars(recentReview?.rating)}
           </div>
           <div style={{fontSize: '12px', color: '#888'}}>
             {recentReview?.date || 'Hôm nay'}
           </div>
        </div>
        <p style={{fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5}}>
          "{recentReview?.comment || 'Phòng khám dịch vụ rất tốt.'}"
        </p>
      </div>

      {/* AI INSIGHT */}
      <div className={styles.card}>
        {/* ... Giữ nguyên phần AI Insight như code cũ của bạn ... */}
      </div>
    </>
  );
};

export default SidebarWidgets;