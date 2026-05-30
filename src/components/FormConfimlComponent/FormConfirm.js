import { useEffect, useState } from "react";
import { Exit } from "../ButtonComponent/Button";
import "./FormConfirm.css";
import apiClient from "../../api/api";
import { Link } from "react-router-dom";

const FormConfiml = ({
  dataDocter,
  dataClinic,
  day,
  hour,
  setClickBooking,
  handelShowMessage,
  caseBooking,
  camBook,
  reasonBooking,
  setReasonBooking
}) => {
  const handelClickExit = () => {
    setClickBooking(false);
  };
  const [patient, setPatient] = useState();
  const [doctor, setDoctor] = useState();
  const [clinic, setClinic] = useState();

  useEffect(() => {
    const getDataPatient = async () => {
      const dataPatient = await apiClient.get(`/api/v1/patient/${localStorage.getItem("idPatient")}`);
      const dataClinicRes = await apiClient.get(`/api/v1/clinics/${dataClinic}`);
      const dataDoctor = await apiClient.get(`/api/v1/doctors/${dataDocter}`);

      setPatient(dataPatient.data);
      setDoctor(dataDoctor.data);
      setClinic(dataClinicRes.data);

    }
    getDataPatient();
  }, [])

  return (
    <>
      <div className="container-formConfirm">
        <p className="confirm-title">Xác nhận đặt lịch khám</p>
        <div className="confirm-table-wrapper">
          <table className="confirm-table">
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Ngày sinh</th>
                <th>Số điện thoại</th>
                <th>Tên phòng khám</th>
                <th>Địa chỉ</th>
                <th>Hình thức khám</th>
                <th>Tên bác sĩ</th>
                <th>Chuyên khoa</th>
                <th>Thời gian khám bệnh</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{patient?.taiKhoan?.hoVaTen}</td>
                <td>{patient?.ngaySinh}</td>
                <td>{patient?.soDienThoai}</td>
                <td>{clinic?.tenPhongKham}</td>
                <td>{clinic?.diaChi}</td>
                <td>{caseBooking}</td>
                <td>{doctor?.taiKhoan?.hoVaTen}</td>
                <td>{doctor?.specialty.tenChuyenKhoa}</td>
                <td>
                  {day}: {hour}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="reason-booking">
            <label>Lý do khám bệnh</label>

            <textarea
              placeholder="Nhập lý do khám bệnh..."
              value={reasonBooking}
              onChange={(e) => setReasonBooking(e.target.value)}
            />
          </div>
        </div>
        <div style={{ textAlign: "end" }}>
          <Exit name={"Thoát"} className={"exit"} clickExit={handelClickExit} />
          <Exit
            name={"Xác nhận"}
            className={"confirm"}
            handelShowMessage={handelShowMessage}
          />
        </div>
        {camBook && <p className="cam-dat">Chúng tôi nhận thấy rằng bạn đang có lịch khám tại phòng khám này, nên không được tiếp tục đặt 1 lịch khám khác. chi tiết xem <Link to={"/huong-dan-he-thong"}>tại đây</Link></p>}
      </div>
    </>
  );
};

export default FormConfiml;
