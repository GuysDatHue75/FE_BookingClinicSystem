import styles from "./Statistical.module.css";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Statistical = () => {
  const [data] = useState([
    { month: "1", revenue: 12000000, visits: 230 },
    { month: "2", revenue: 18500000, visits: 320 },
    { month: "3", revenue: 15600000, visits: 280 },
    { month: "4", revenue: 22000000, visits: 410 },
    { month: "5", revenue: 19800000, visits: 360 },
    { month: "6", revenue: 24500000, visits: 450 },
    { month: "7", revenue: 23000000, visits: 420 },
    { month: "8", revenue: 26000000, visits: 500 },
    { month: "9", revenue: 21000000, visits: 370 },
    { month: "10", revenue: 27000000, visits: 520 },
    { month: "11", revenue: 25000000, visits: 480 },
    { month: "12", revenue: 30000000, visits: 600 },
  ]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Thống kê</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Doanh thu (VNĐ)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN").format(value)
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Lượt đăng ký</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" fill="#3b82f6" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistical;
