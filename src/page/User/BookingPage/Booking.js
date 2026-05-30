import Header from "../../../layouts/LayoutsUser/Header/Header.js";
import "./Booking.css";
import dataClinic from "../../../data/clinic.json";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DetaiClinicCpn from "../../../components/DetailClinicComponent/DetaiClinicCpn.js";
import Button from "../../../components/ButtonComponent/Button.js";
import Footer from "../../../components/FooterComponent/Footer.js";
import CadendaBooking from "../../../data/CalendaBooking.json";
import FormConfiml from "../../../components/FormConfimlComponent/FormConfirm.js";
import Opacity from "../../../components/OpacityComponent/Opacity.js";
import Message from "../../../components/MessageComponent/Message.js";
import { State } from "../../../state/context.js";
import calendaDone from "../../../data/calendaDone.json";
import apiClient from "../../../api/api.js";
import avtErr from "../../../assets/image/user-avt.png"
import Loading from "../../../components/LoadingComponent/Loading.js";
const Booking = () => {
  const now = new Date();
  const { id: slugParam } = useParams();
  const [reasonBooking, setReasonBooking] = useState("");
  const [day, setDay] = useState();
  const [hour, setHour] = useState();
  const [caseBooking, setCaseBooking] = useState();
  const [cam, setCam] = useState(false);
  const [clickBooking, setClickBooking] = useState(false);
  const { messageRef } = useContext(State);
  const { loading, setLoading } = useContext(State);
  const idDocterBooking = localStorage.getItem("idDocter");
  const idPatientBooking = localStorage.getItem("idPatient");


  const [dataDoctor, setDataDoctor] = useState();
  const [dataClinic, setDataClinic] = useState();
  const [idSchedule, setIdSchedule] = useState();
  const [countNumberBooking, setcountNumberBooking] = useState();

  const [scheduleData, setScheduleData] = useState([]);
  const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const getWeekRange = () => {
    const now = new Date();
    const day = now.getDay();

    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);

    const format = (d) => d.toISOString().split("T")[0];

    return {
      startDate: format(monday),
      endDate: format(saturday),
    };
  };
  useEffect(() => {
    const getData = async () => {
      if (!idDocterBooking) return;

      setLoading(true);
      try {
        const { startDate, endDate } = getWeekRange();
        const responseDoctor = await apiClient.get(`/api/v1/doctors/${idDocterBooking}`);

        const response = await apiClient.get(
          `/api/v1/doctor-schedules/list?maBacSi=${idDocterBooking}&startDate=${startDate}&endDate=${endDate}`);
        const doctorData = responseDoctor.data;


        setDataDoctor(doctorData);
        setScheduleData(response.data);
        setDataClinic(doctorData.phongKham || null);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu đặt lịch:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
    window.scrollTo(0, 0);
  }, [idDocterBooking]);
  const convertUIToAPIFormat = (slot) => {
    const convert = (t) => {
      if (t.includes("h30")) {
        const h = t.replace("h30", "");
        return h.padStart(2, "0") + ":30";
      } else {
        const h = t.replace("h", "");
        return h.padStart(2, "0") + ":00";
      }
    };

    const [start, end] = slot.split("-");
    return `${convert(start)} - ${convert(end)}`;
  };


  const groupByDay = (data) => {
    const result = {};

    data.forEach((item) => {
      result[item.thuTrongTuan] = item.danhSachLich;
    });

    return result;
  };

  const groupedSchedule = groupByDay(scheduleData);

  const handelConfirmBooking = async (item) => {
    const response = await apiClient.get(`/api/v1/c-booking-calendar?idPatient=${idPatientBooking}&idClinic=${slugParam}`);
    setcountNumberBooking(response.data.soLanDat);
    setDay(item.ngayLamViec);
    setHour(item.khungGio);
    setClickBooking(true);
    setIdSchedule(item.maLichLam);
    setCaseBooking(item.loaiHinhKham)
  };

  const getClassByStatus = (status) => {
    switch (status) {
      case "DaDat":
        return "slot-booked";
      case "KhongHoatDong":
        return "slot-disabled";
      case "HoatDong":
        return "slot-active";
      default:
        return "slot-disabled";
    }
  };
  useEffect(() => {
    if (clickBooking) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [clickBooking]);
  const handelShowMessage = async () => {
    console.log(hour);
    

    if (countNumberBooking >= 1) {
      setCam(true);
      return;
    }

    await apiClient.post(`/api/v1/calendar/${idSchedule}`, {
      patient: {
        maBenhNhan: localStorage.getItem("idPatient")
      },
      bacSi: {
        maBacSi: idDocterBooking
      },
      ngayKham: day,
      gioKham: hour.split(" - ")[0],
      loaiKham: caseBooking,
      trangThai: "ChoXacNhan",
      ngayTao: new Date().toISOString(),
      lyDoKham: reasonBooking
    });

    setScheduleData(prev =>
      prev.map(dayItem => ({
        ...dayItem,
        danhSachLich: dayItem.danhSachLich.map(slot => {
          if (slot.maLichLam === idSchedule) {
            return { ...slot, trangThai: "DaDat" };
          }
          return slot;
        })
      }))
    );

    messageRef.current.style.transform = "translateX(0%)";

    setClickBooking(false);

    setTimeout(() => {
      if (messageRef.current)
        messageRef.current.style.transform = "translateX(104%)";
    }, 2000);
  };
  if (loading) return <Loading />;
  return (
    <>
      {clickBooking && <Opacity booking={true} />}
      <div>
        {clickBooking && (
          <FormConfiml
            dataDocter={idDocterBooking}
            dataClinic={slugParam}
            day={day}
            hour={hour}
            setClickBooking={setClickBooking}
            handelShowMessage={handelShowMessage}
            caseBooking={caseBooking}
            camBook={cam}
            reasonBooking={reasonBooking}
            setReasonBooking={setReasonBooking}
          />
        )}
        <Header />
        <div className="container-booking">
          <h2 style={{ marginBottom: "20px", color: "#1250DC" }}>
            Thông tin phòng khám
          </h2>
          {dataClinic ? (
            <DetaiClinicCpn clinicDetailShow={dataClinic} />
          ) : (
            <p>Đang tải thông tin phòng khám...</p>
          )}
          <h2 style={{ marginTop: "20px", color: "#1250DC" }}>
            Thông tin bác sĩ
          </h2>
          <div className="wrapper-booking">
            <img src={dataDoctor?.avt || avtErr} className="image-booking" />
            <div className="infor-docter-booking">
              <p className="name-docter-booking">
                {dataDoctor?.hocHam + " " + dataDoctor?.taiKhoan.hoVaTen} -{" "}
                <span className="specialty-booking">
                  Trưởng khoa {dataDoctor?.specialty.tenChuyenKhoa}{" "}
                </span>{" "}
              </p>
              <p style={{ marginBottom: "10px" }}>
                {dataDoctor?.mieuTa1}
              </p>
              <Button
                booking={true}
                path={`/xem-chi-tiet-bac-si/${dataDoctor?.maBacSi}`}
                idDocter={dataDoctor?.maBacSi}
              />
            </div>
          </div>
          <div>
            <h2 style={{ marginTop: "20px", color: "#1250DC" }}>
              Khung giờ đặt khám
            </h2>
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Buổi</th>
                  {DAYS.map((d, i) => (
                    <th key={i}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Buổi sáng</td>
                  {DAYS.map((thu, i) => {
                    const list = groupedSchedule[thu] || [];
                    const morningList = list.filter((item) => {
                      const hour = parseInt(item.khungGio.split(":")[0]);
                      return hour < 12;
                    });

                    return (
                      <td key={i}>
                        <div className="time-list">
                          {morningList.length > 0 ? (
                            morningList.map((item, idx) => (
                              <div
                                className={`active-slot ${getClassByStatus(item.trangThai)}`}
                                onClick={() => {
                                  if (item.trangThai === "HoatDong") {
                                    handelConfirmBooking(item);
                                  }
                                }}
                              >
                                {item.khungGio}
                              </div>
                            ))
                          ) : (
                            <span className="no-slot">Không có lịch</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td>Buổi chiều</td>
                  {DAYS.map((thu, i) => {
                    const list = groupedSchedule[thu] || [];

                    const afternoonList = list.filter((item) => {
                      const hour = parseInt(item.khungGio.split(":")[0]);
                      return hour >= 12;
                    });

                    return (
                      <td key={i}>
                        <div className="time-list">
                          {afternoonList.length > 0 ? (
                            afternoonList.map((item, idx) => (
                              <div
                                className={`active-slot ${getClassByStatus(item.trangThai)}`}
                                onClick={() => {
                                  if (item.trangThai === "HoatDong") {
                                    handelConfirmBooking(item);
                                  }
                                }}
                              >
                                {item.khungGio}
                              </div>
                            ))
                          ) : (
                            <span className="no-slot">Không có lịch</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="ct">
            <h3>Chú thích</h3>
            <div style={{ display: "flex" }}>
              <div className="ct-wrapper">
                <span className="ct-book"></span>
                <p>Khung giờ chưa ai đặt</p>
              </div>
              <div className="ct-wrapper">
                <span className="ct-disable"></span>
                <p>Khung giờ đã được đặt</p>
              </div>
              <div className="ct-wrapper">
                <span className="ct-active"></span>
                <p>Khung giờ đã bị hủy</p>
              </div>
              <div className="ct-wrapper">
                <span >Không có lịch: </span>
                <p>Không có khung giờ khám</p>
              </div>
            </div>
          </div>
        </div>
        <Message ref={messageRef} />
        <Footer />
      </div>
    </>
  );
};

export default Booking;
