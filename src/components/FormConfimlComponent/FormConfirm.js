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

        <div className="confirm-info-wrapper">
          <div className="info-item">
            <span className="label">Họ và tên:</span>
            <span>{patient?.taiKhoan?.hoVaTen}</span>
          </div>

          <div className="info-item">
            <span className="label">Ngày sinh:</span>
            <span>{patient?.ngaySinh}</span>
          </div>
          <div className="info-item">
            <span className="label">Số điện thoại:</span>
            <span>{patient?.soDienThoai}</span>
          </div>

          <div className="info-item">
            <span className="label">Tên phòng khám:</span>
            <span>{clinic?.tenPhongKham}</span>
          </div>

          <div className="info-item">
            <span className="label">Địa chỉ:</span>
            <span>{clinic?.diaChi}</span>
          </div>

          <div className="info-item">
            <span className="label">Hình thức khám:</span>
            <span>{caseBooking}</span>
          </div>

          <div className="info-item">
            <span className="label">Tên bác sĩ:</span>
            <span>{doctor?.taiKhoan?.hoVaTen}</span>
          </div>

          <div className="info-item">
            <span className="label">Chuyên khoa:</span>
            <span>{doctor?.specialty?.tenChuyenKhoa}</span>
          </div>

          <div className="info-item">
            <span className="label">Thời gian khám bệnh:</span>
            <span>
              {day}: {hour}
            </span>
          </div>

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
