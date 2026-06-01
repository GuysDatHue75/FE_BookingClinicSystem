import React from 'react';
import Chart from 'react-apexcharts';

const PatientOverviewChart = () => {
  // Dữ liệu mock tĩnh (Vì DB hiện tại chưa có logic tính tuổi)
  // Bạn có thể thay bằng dữ liệu thật từ Backend sau này
  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4 // Bo góc cột cho giống thiết kế
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: ['4 Jul', '5 Jul', '6 Jul', '7 Jul', '8 Jul', '9 Jul', '10 Jul', '11 Jul'],
    },
    fill: { opacity: 1 },
    legend: { position: 'top', horizontalAlign: 'left' },
    colors: ['#1e293b', '#67e8f9', '#e0f2fe'] // Màu xanh đậm, xanh lợt, xám nhạt
  };

  const chartSeries = [
    { name: 'Child', data: [44, 55, 57, 56, 61, 58, 63, 60] },
    { name: 'Adult', data: [76, 85, 101, 98, 87, 105, 91, 114] },
    { name: 'Elderly', data: [35, 41, 36, 26, 45, 48, 52, 53] }
  ];

  return (
    <div className="chart-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0' }}>Patient Overview</h4>
          <span style={{ fontSize: '12px', color: '#888' }}>by Age Stages</span>
        </div>
      </div>
      <Chart options={chartOptions} series={chartSeries} type="bar" height={250} />
    </div>
  );
};

export default PatientOverviewChart;