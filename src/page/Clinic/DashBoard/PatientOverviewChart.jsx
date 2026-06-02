import React from 'react';
import Chart from 'react-apexcharts';

const PatientOverviewChart = ({ data }) => {
  // Bóc tách dữ liệu từ API, fallback về mảng rỗng nếu chưa có data
  const categories = data?.categories || [];
  const childData = data?.childData || [];
  const adultData = data?.adultData || [];
  const elderlyData = data?.elderlyData || [];

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 4 
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: categories,
      labels: { style: { colors: '#888', fontSize: '12px' } }
    },
    yaxis: {
      labels: { style: { colors: '#888' } }
    },
    fill: { opacity: 1 },
    legend: { position: 'top', horizontalAlign: 'left', markers: { radius: 12 } },
    colors: ['#1e293b', '#67e8f9', '#e0f2fe'] 
  };

  const chartSeries = [
    { name: 'Child', data: childData },
    { name: 'Adult', data: adultData },
    { name: 'Elderly', data: elderlyData }
  ];

  return (
    <div className="chart-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1a1a1a' }}>Patient Overview</h4>
          <span style={{ fontSize: '12px', color: '#888' }}>by Age Stages</span>
        </div>
        <div>
          {/* Nút dropdown giả lập thiết kế */}
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#1e293b', color: '#fff', fontSize: '12px', cursor: 'pointer'}}>
            Last 8 Days ⌄
          </button>
        </div>
      </div>
      <Chart options={chartOptions} series={chartSeries} type="bar" height={250} />
    </div>
  );
};

export default PatientOverviewChart;