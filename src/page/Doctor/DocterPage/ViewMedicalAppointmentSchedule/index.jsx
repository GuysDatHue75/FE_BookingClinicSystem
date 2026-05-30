import React, { useState, useEffect } from 'react';
import apiClient from '../../../../api/api';
import styles from './AppointmentApproval.module.css';

const ConfirmAppointmentPage = () => {
  const maBacSi = localStorage.getItem('idDoctor');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bảng Map cứng mã khung giờ ra Text để hiển thị (Khớp với dữ liệu DB của bạn)
  const timeSlotMap = {
    'KG01': '07:30 - 08:00', 'KG02': '08:00 - 08:30', 'KG03': '08:30 - 09:00',
    'KG04': '09:00 - 09:30', 'KG05': '09:30 - 10:00', 'KG06': '10:00 - 10:30',
    'KG07': '10:30 - 11:00', 'KG08': '13:00 - 13:30', 'KG09': '13:30 - 14:00',
    'KG10': '14:30 - 15:00', 'KG11': '15:00 - 15:30', 'KG12': '15:30 - 16:00',
    'KG13': '16:00 - 16:30', 'KG14': '16:30 - 17:00'
  };

  // Định dạng ngày hiển thị (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Tính tuổi từ ngày sinh
  const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // 1. GỌI API LẤY DANH SÁCH CHỜ DUYỆT VÀ SẮP XẾP 
  const fetchPendingAppointments = async () => {
    if (!maBacSi) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/v1/confirm-appointment/pending`, {
        params: { maBacSi }
      });

      // Lấy dữ liệu mảng
      let data = res.data || [];

      // Thuật toán sắp xếp (Sort)
      data.sort((a, b) => {
        const dateA = new Date(a.ngayLamViec);
        const dateB = new Date(b.ngayLamViec);

        // 1. So sánh ngày: Ngày gần nhất (nhỏ hơn) xếp lên trước
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        // 2. Nếu trùng ngày, so sánh tiếp đến mã khung giờ (KG01 -> KG14)
        if (a.maKhungGio < b.maKhungGio) return -1;
        if (a.maKhungGio > b.maKhungGio) return 1;

        return 0;
      });

      setAppointments(data);
    } catch (err) {
      console.error("Lỗi tải danh sách lịch khám:", err);
      alert("Lỗi tải danh sách: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, [maBacSi]);

  // 2. XỬ LÝ DUYỆT HOẶC TỪ CHỐI
  const handleAction = async (maLichKham, actionType) => {
    const isApprove = actionType === 'DaXacNhan';
    const confirmMessage = isApprove
      ? "Bạn có chắc chắn XÁC NHẬN lịch khám này?"
      : "Bạn có chắc chắn TỪ CHỐI lịch khám này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      // Theo backend, DTO cần chứa maLichKham và trangThai
      const payload = {
        maLichKham: maLichKham,
        trangThai: actionType
      };

      const res = await apiClient.put(`/api/v1/confirm-appointment/approve`, payload);
      alert(res.data.message || "Xử lý thành công!");

      // Render lại danh sách sau khi duyệt
      fetchPendingAppointments();
    } catch (err) {
      console.error("Lỗi xử lý lịch khám:", err);
      alert("Thất bại: " + (err.response?.data || err.message));
    }
  };

  if (!maBacSi) return (<div className={styles.noAuth}><h2>Vui lòng đăng nhập</h2></div>);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2><i className="fa-solid fa-clipboard-user"></i> Quản lý yêu cầu đặt lịch</h2>
      </div>

      {/* Giả lập Tab giống thiết kế */}
      <div className={styles.tabs}>
        <div className={`${styles.tabItem} ${styles.activeTab}`}>
          Yêu cầu mới (Chờ xác nhận) <span className={styles.badge}>{appointments.length}</span>
        </div>
        {/* Các tab khác (Đã xác nhận, Đã hủy) có thể phát triển thêm sau */}
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loading}><i className="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Bệnh nhân</th>
                <th>Giới tính</th>
                <th>Tuổi</th>
                <th>Số điện thoại</th>
                <th>Thời gian khám</th>
                <th style={{ width: '25%' }}>Lý do khám</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles.emptyState}>
                    <i className="fa-regular fa-folder-open"></i>
                    <p>Không có yêu cầu đặt lịch nào đang chờ.</p>
                  </td>
                </tr>
              ) : (
                appointments.map((item, index) => {
                  // Kiểm tra xem lịch này đã thuộc về quá khứ chưa
                  const isPastDate = new Date(item.ngayLamViec) < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <tr key={item.maLichKham} style={{ opacity: isPastDate ? 0.6 : 1 }}>
                      <td className={styles.textCenter}>{index + 1}</td>
                      <td className={styles.patientName}>
                        {item.hoVaTen}
                        {isPastDate && <span style={{ color: '#ef4444', fontSize: '12px', display: 'block' }}> (Đã quá hạn)</span>}
                      </td>
                      <td>{item.gioiTinh ? 'Nam' : 'Nữ'}</td>
                      <td>{calculateAge(item.ngaySinh)}</td>
                      <td className={styles.phoneText}>{item.soDt}</td>
                      <td>
                        <div className={styles.dateTimeBox}>
                          <span className={styles.timeLabel}>
                            <i className="fa-regular fa-clock"></i> {timeSlotMap[item.maKhungGio] || item.maKhungGio}
                          </span>
                          <span className={styles.dateLabel} style={{ color: isPastDate ? '#ef4444' : '#64748b', fontWeight: isPastDate ? 'bold' : 'normal' }}>
                            <i className="fa-regular fa-calendar-days"></i> {formatDate(item.ngayLamViec)}
                          </span>
                        </div>
                      </td>
                      <td className={styles.reasonText}>{item.lyDoKham || 'Không có ghi chú'}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.btnApprove}
                            title={isPastDate ? "Không thể duyệt lịch trong quá khứ" : "Xác nhận"}
                            disabled={isPastDate}
                            style={{ cursor: isPastDate ? 'not-allowed' : 'pointer', filter: isPastDate ? 'grayscale(100%)' : 'none' }}
                            onClick={() => handleAction(item.maLichKham, 'DaXacNhan')}
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button
                            className={styles.btnReject}
                            title="Từ chối"
                            onClick={() => handleAction(item.maLichKham, 'DaHuy')}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ConfirmAppointmentPage;