import React from 'react';
import styles from './Dashboard.module.css';

// Hàm xử lý hiển thị phần trăm tăng/giảm động
const PercentBadge = ({ percent }) => {
  // Nếu BE chưa trả dữ liệu, tạm ẩn
  if (percent === undefined || percent === null) return null;

  const isPositive = percent > 0;
  const isNegative = percent < 0;

  let color = '#888888'; // Màu xám mặc định nếu = 0
  let icon = '−';
  let text = `${percent}%`;
  let bgColor = '#f3f4f6'; // Nền xám nhạt

  if (isPositive) {
    color = '#10b981'; // Xanh lá
    bgColor = '#d1fae5'; // Nền xanh nhạt
    icon = '↗';
    text = `+${percent}%`;
  } else if (isNegative) {
    color = '#ef4444'; // Đỏ
    bgColor = '#fee2e2'; // Nền đỏ nhạt
    icon = '↘';
    text = `${percent}%`; // Số âm tự có dấu trừ
  }

  return (
    <div style={{ 
      fontSize: '12px', 
      color: color, 
      backgroundColor: bgColor,
      padding: '2px 8px', 
      borderRadius: '12px',
      fontWeight: '600',
      display: 'inline-block'
    }}>
      {icon} {text}
    </div>
  );
};

const KpiCards = ({ data }) => {
  return (
    <div className={styles.kpiGrid}>
      {/* Card 1: Doanh thu */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#888', fontSize: '14px', fontWeight: 500 }}>Total Invoice</div>
        </div>
        <div className={styles.kpiValue}>{data?.totalInvoice || '0'}</div>
        {/* Truyền dữ liệu phần trăm từ BE vào đây */}
        <PercentBadge percent={data?.invoicePercent} />
      </div>

      {/* Card 2: Bệnh nhân */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#888', fontSize: '14px', fontWeight: 500 }}>Total Patients</div>
        </div>
        <div className={styles.kpiValue}>{data?.totalPatients || '0'}</div>
        <PercentBadge percent={data?.patientPercent} />
      </div>

      {/* Card 3: Lịch khám */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#888', fontSize: '14px', fontWeight: 500 }}>Appointments</div>
        </div>
        <div className={styles.kpiValue}>{data?.totalAppointments || '0'}</div>
        <PercentBadge percent={data?.appointmentPercent} />
      </div>

      {/* Card 4: Phòng bệnh (Fix cứng Bedroom nhưng phần trăm có thể fix tạm) */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#888', fontSize: '14px', fontWeight: 500 }}>Bedroom</div>
        </div>
        <div className={styles.kpiValue}>0</div> 
        <PercentBadge percent={0} /> {/* Fix cứng 0% vì dữ liệu Bedroom bằng 0 */}
      </div>
    </div>
  );
};

export default KpiCards;