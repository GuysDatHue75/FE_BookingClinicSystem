import { useContext, useEffect, useState } from "react";
import "./AppointmentList.css";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import Footer from "../../../components/FooterComponent/Footer";
import { State } from "../../../state/context";
import apiClient from "../../../api/api";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import { data } from "react-router-dom";
const AppointmentList = () => {
  const { bookingDone } = useContext(State);
  const [appointments, setAppointments] = useState([]);
  const idPatient = localStorage.getItem('idPatient');
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'primary',
    onConfirm: () => { }
  });
  useEffect(() => {
    if (bookingDone && bookingDone.clinic) {
      setAppointments((prev) => [...prev, bookingDone]);
    }
  }, [bookingDone]);
  const cancelAppointment = async (appt) => {
    
    setModalConfig(
      {
        isOpen: true,
        title: "Xác nhận xóa",
        message: `${appt.trangThai === "DaHuy" ? "Bạn có muốn xóa lịch khám này?" : "Bạn có muốn hủy lịch khám này?"}`,
        type: "danger",
        onConfirm: async () => {
          const res = await apiClient.delete(`/api/v1/calendar`, {
            data: {
              idSchedule: appt?.doctorSchedule?.maLichLamViec,
              idCalendar: appt.maLichKham
            }
          })
          window.location.reload();
        }
      }
    )
  };
  useEffect(() => {
    const getData = async () => {
      const [res1, res2, res3, res4] = await Promise.all([
        apiClient.get(`/api/v1/calendars?id=${idPatient}&status=DaXacNhan`),
        apiClient.get(`/api/v1/calendars?id=${idPatient}&status=DaHuy`),
        apiClient.get(`/api/v1/calendars?id=${idPatient}&status=ChoXacNhan`),
        apiClient.get(`/api/v1/calendars?id=${idPatient}&status=DaTuChoi`)
      ]);
      const dataAppt = [...(res1.data || []), ...(res2.data || []), ...(res3.data || []), ...(res4.data || [])]
      setAppointments(dataAppt);
    }
    getData();
    window.scrollTo({
      top: "true",
      behavior: "instant",
    });
  }, []);
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });
  return (
    <>
      <Header />
      <div className="appointment-container">
        <h2>Lịch khám đã đặt</h2>
        <div className="table-wrapper">
          {appointments.length > 0 ? (
            <table className="appointment-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Phòng khám</th>
                  <th>Bác sĩ</th>
                  <th>Địa chỉ</th>
                  <th>Ngày giờ</th>
                  <th>Hình thức khám</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>

                {appointments.map((appt, index) => (
                  <tr key={appt.id}>
                    <td>{index + 1}</td>
                    <td>Phòng khám {appt.bacSi.phongKham.tenPhongKham}</td>
                    <td>{appt.bacSi.taiKhoan.hoVaTen}</td>
                    <td>{appt.bacSi.phongKham.diaChi}</td>
                    <td>{appt.ngayKham + " " + appt.gioKham}</td>
                    <td>{appt.loaiKham}</td>
                    <td>
                      <span
                        className={`status ${appt.trangThai === "DaXacNhan"
                          ? "confirmed"
                          : appt.trangThai === "ChoXacNhan" ? "pending" : "closeAppt"
                          }`}
                      >
                        {appt.trangThai === "ChoXacNhan" ? "Chờ xác nhận" : appt.trangThai === "DaHuy" ? "Đã hủy" : appt.trangThai === "DaTuChoi" ? "Đã bị từ chối" : "Đã xác nhận"}
                      </span>
                    </td>
                    <td>
                      {appt.status === "DaXacNhan" ? (
                        <i class="fa-solid fa-circle-check"></i>
                      ) : appt.status === "DaHuy" ?
                        <i
                          class="fa-solid fa-circle-xmark"
                          onClick={() => cancelAppointment(appt)}
                        ></i> : <i
                          class="fa-solid fa-circle-xmark"
                          onClick={() => cancelAppointment(appt)}
                        ></i>
                      }
                    </td>
                  </tr>
                ))
                }
              </tbody>
            </table>) : (
            <p style={{ textAlign: "center" }}>
              Không có lịch khám nào.
            </p>
          )}
        </div>
      </div>
      <ConfirmModal
        {...modalConfig}
        onClose={closeModal}
      />
    </>
  );
};

export default AppointmentList;
