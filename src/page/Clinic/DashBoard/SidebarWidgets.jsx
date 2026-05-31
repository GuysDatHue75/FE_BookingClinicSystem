import React from 'react';
import styles from './Dashboard.module.css';

const SidebarWidgets = () => {
  // Mock data cho heatmap (đậm nhạt của màu xanh)
  const heatmapColors = ['#e0f2fe', '#bae6fd', '#38bdf8', '#0ea5e9'];
  
  return (
    <>
      {/* 1. Heatmap Giờ cao điểm */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>Giờ cao điểm lịch hẹn</div>
        <div className={styles.heatmapGrid}>
          {/* Render mock UI giống hình 5 */}
          <div></div><div>8h</div><div>10h</div><div>12h</div><div>14h</div><div>16h</div>
          <div>T2</div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[2]}}></div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[3]}}></div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[3]}}></div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[1]}}></div>
          <div className={styles.heatmapCell} style={{background: heatmapColors[0]}}></div>
          {/* ... Bạn có thể copy thêm các dòng T3, T4 cho đầy đủ ... */}
        </div>
      </div>

      {/* 2. Recent Review */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
          <div className={styles.cardTitle} style={{margin: 0}}>Recent</div>
          <div style={{fontSize: '14px', fontWeight: 500}}>Nguyễn Tuấn</div>
        </div>
        <div style={{color: '#fbbf24', marginBottom: '8px'}}>★★★★☆</div>
        <p style={{fontSize: '13px', color: '#666', margin: 0}}>
          The doctor provided very thorough advice, and I didn't have to wait long.
        </p>
      </div>

      {/* 3. AI Insight (Fix cứng) */}
      <div className={styles.card}>
        <div className={styles.cardTitle} style={{textAlign: 'center'}}>🤖 AI Insight</div>
        <div className={styles.aiInsightBox}>
          <p><strong>📊 Dữ liệu hôm nay</strong><br/>- 124 lượt khám<br/>- +18% so với hôm qua</p>
          <p><strong>⏰ Cao điểm</strong><br/>10:00 - 14:00</p>
          <p><strong>⚠️ Cảnh báo</strong><br/>Có nguy cơ quá tải trong tuần</p>
          <p><strong>💡 Đề xuất giải pháp</strong><br/>▸ Mở thêm lịch bác sĩ<br/>▸ Ưu tiên bệnh nhân đặt trước</p>
        </div>
        <input 
          type="text" 
          placeholder="Nhập tin nhắn..." 
          style={{width: '100%', padding: '8px', marginTop: '16px', borderRadius: '8px', border: '1px solid #ccc'}}
          disabled 
        />
      </div>
    </>
  );
};

export default SidebarWidgets;