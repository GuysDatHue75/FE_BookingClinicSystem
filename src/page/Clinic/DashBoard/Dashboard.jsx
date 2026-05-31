import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import axiosClient from '../../../utils/axios'; // Đảm bảo đường dẫn này đúng với dự án của bạn
import KpiCards from './KpiCards';
import SidebarWidgets from './SidebarWidgets';
import RevenueChart from './RevenueChart';
import AppointmentTable from './AppointmentTable';
import PatientOverviewChart from './PatientOverviewChart'; 

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Lấy mã phòng khám từ Local Storage đã được AuthContext lưu lại
    const maPhongKham = localStorage.getItem('idPhongKham');

    // 2. Kiểm tra an toàn bảo mật
    if (!maPhongKham) {
      setError("Không tìm thấy mã phòng khám. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    // 3. Gọi API với mã phòng khám động (dùng template literal ``)
    axiosClient.get(`/api/v1/adminclinic/dashboard/summary/${maPhongKham}`)
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi tải dữ liệu Dashboard:', err);
        setError("Có lỗi xảy ra khi tải dữ liệu thống kê.");
        setLoading(false);
      });
  }, []);

  // Giao diện khi đang tải
  if (loading) return <div style={{ padding: '20px' }}>Đang tải dữ liệu...</div>;
  
  // Giao diện khi bị lỗi (VD: Mất local storage)
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.mainGrid}>
        
        {/* --- CỘT TRÁI --- */}
        <div className={styles.leftColumn}>
          
          <KpiCards data={dashboardData} />

          <div className={styles.chartsGrid}>
             <div className={styles.card}>
               <PatientOverviewChart data={dashboardData?.patientOverview} />
             </div>
             
             <div className={styles.card}>
               <RevenueChart data={dashboardData?.revenueLast7Days} />
             </div>
          </div>

          <div className={styles.card}>
             <AppointmentTable appointments={dashboardData?.recentAppointments} />
          </div>
          
        </div>

        {/* --- CỘT PHẢI --- */}
        <div className={styles.rightColumn}>
          <SidebarWidgets data={dashboardData?.sidebarWidgets} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;