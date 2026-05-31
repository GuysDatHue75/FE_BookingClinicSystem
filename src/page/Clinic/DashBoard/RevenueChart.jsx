import React from 'react';
import Chart from 'react-apexcharts';

const RevenueChart = ({ data }) => {
  // Map dữ liệu từ Backend DTO (revenueLast7Days)
  const categories = data ? data.map(item => item.date) : [];
  const seriesData = data ? data.map(item => item.income) : [];

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: categories },
    colors: ['#008FFB'], // Màu xanh giống thiết kế
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
      }
    }
  };

  const chartSeries = [{
    name: 'Income',
    data: seriesData
  }];

  return (
    <div className="chart-wrapper">
      <h4>Revenue</h4>
      <Chart options={chartOptions} series={chartSeries} type="area" height={250} />
    </div>
  );
};

export default RevenueChart;