import React from 'react';
import Chart from 'react-apexcharts';

const RevenueChart = ({ data }) => {
  const categories = data?.categories || [];
  const incomeData = data?.incomeData || [];
  const expenseData = data?.expenseData || [];

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { 
      categories: categories,
      labels: { style: { colors: '#888', fontSize: '12px' } }
    },
    yaxis: {
      labels: { 
        style: { colors: '#888' },
        formatter: (value) => value >= 1000 ? `${(value/1000).toFixed(1)}K` : value 
      }
    },
    colors: ['#1e293b', '#67e8f9'], // Xanh đen cho Income, Xanh nhạt cho Expense
    legend: { position: 'top', horizontalAlign: 'left' },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.1,
        opacityTo: 0.01,
      }
    }
  };

  const chartSeries = [
    { name: 'Income', data: incomeData },
    { name: 'Expense', data: expenseData }
  ];

  return (
    <div className="chart-wrapper">
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h4 style={{ margin: '0', fontSize: '16px', color: '#1a1a1a' }}>Revenue</h4>
        <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', padding: '4px 12px', background: '#1e293b', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Week</span>
          <span style={{ fontSize: '12px', padding: '4px 12px', color: '#666', cursor: 'pointer' }}>Month</span>
          <span style={{ fontSize: '12px', padding: '4px 12px', color: '#666', cursor: 'pointer' }}>Year</span>
        </div>
      </div>
      <Chart options={chartOptions} series={chartSeries} type="area" height={250} />
    </div>
  );
};

export default RevenueChart;