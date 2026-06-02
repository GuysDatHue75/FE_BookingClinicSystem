import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import axiosClient from '../../../utils/axios'; 
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
    // Gọi API của Spring Boot. Token JWT đã được axiosClient tự động đính kèm.
    // BackEnd sẽ trả về object DashboardResponseDTO chứa toàn bộ dữ liệu.
    axiosClient.get('/api/clinic/dashboard')
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi tải dữ liệu Dashboard:', err);
        setError("Có lỗi xảy ra khi tải dữ liệu thống kê từ Server.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.mainGrid}>
        
        {/* --- CỘT TRÁI --- */}
        <div className={styles.leftColumn}>
          
          <KpiCards data={dashboardData?.kpi} />

          <div className={styles.chartsGrid}>
             <div className={styles.card}>
               <PatientOverviewChart data={dashboardData?.ageGroupChart} />
             </div>
             
             <div className={styles.card}>
               <RevenueChart data={dashboardData?.revenueChart} />
             </div>
          </div>

          <div className={styles.card}>
             <AppointmentTable appointments={dashboardData?.recentAppointments} />
          </div>
          
        </div>

        {/* --- CỘT PHẢI --- */}
        <div className={styles.rightColumn}>
          <SidebarWidgets 
             heatmap={dashboardData?.heatmap} 
             recentReview={dashboardData?.recentReview} 
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;