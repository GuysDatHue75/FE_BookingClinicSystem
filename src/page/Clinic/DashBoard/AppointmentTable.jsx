import React from 'react';

const AppointmentTable = ({ appointments }) => {
  if (!appointments || appointments.length === 0) return <p>Không có dữ liệu</p>;

  return (
    <div>
      <h4>Patient Appointment</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Doctor</th>
            <th>Treatment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app, index) => (
            <tr key={index}>
              <td>{app.patientName}</td>
              <td>{app.date}</td>
              <td>{app.time}</td>
              <td>{app.doctorName}</td>
              <td>{app.treatment}</td>
              <td>
                <span style={{ 
                  background: app.status === 'Confirmed' ? '#d1fae5' : '#fee2e2',
                  padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                }}>
                  {app.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;