import { useRef, useState } from "react";
import { createContext } from "react";
import imgae from "../assets/image/user-avt.png";
import dataBookingDone from "../data/calendaDone.json";
export const State = createContext();

const Context = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [resetPage, setResetPage] = useState(true);
  const [valueText, setValueText] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [roleLocal, setRole] = useState("");
  const [notifications, setNotifications] = useState();
  const [feedBack, setFeedBack] = useState(false);
  const [countCalender, setCountCalendar] = useState();
  const [totalNotification, setTotalNotification] = useState(0);
  const [profileClinic, setProfileClinic] = useState({
    id: "CLN-001",
    name: "Phòng khám Đa khoa Hòa Bình",
    type: "Phòng khám đa khoa",
    address: "Số 123, Nguyễn Trãi, Thanh Xuân, Hà Nội",
    email: "contact@hoabinhclinic.vn",
    phone: "0243 888 999",
    establishedDate: "2015-06-12",
    description:
      "Phòng khám đa khoa với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại. Cung cấp các dịch vụ khám tổng quát, nhi khoa, sản phụ khoa, tim mạch, xét nghiệm…",
    openingHours: "Thứ 2–Thứ 7: 07:30–20:00 | Chủ nhật: 08:00–17:00",
    representativeName: "BS. Nguyễn Văn An",
    hometown: "Huế",
    clinicImage:
      "https://penviet.com/wp-content/uploads/2023/05/thiet-ke-phong-kham-da-khoa-dung-chau-3.jpg",
    licenseImage:
      "https://annhien.org/wp-content/uploads/2018/05/Giay-phep-hoat-dong-KCB_Bs-Hanh-2018-1024x724.jpg",
  });
  const [phone, setPhone] = useState("0944364324");
  const [avatar, setAvatar] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&s"
  );
  const [image, setImage] = useState(imgae);
  const [bookingDone, setBookingDone] = useState({
    id: dataBookingDone.length + 1,
    clinic: "",
    doctor: "",
    address: "",
    date: " ",
    time: "",
    method: "Khám trực tiếp",
    status: "Chờ xác nhận",
  });
  const messageRef = useRef();
  return (
    <State.Provider
      value={{
        loading,
        setLoading,
        resetPage,
        setResetPage,
        valueText,
        setValueText,
        searchSpecialty,
        setSearchSpecialty,
        avatar,
        setAvatar,
        messageRef,
        phone,
        setPhone,
        roleLocal,
        setRole,
        image,
        setImage,
        profileClinic,
        setProfileClinic,
        bookingDone,
        setBookingDone,
        notifications,
        setNotifications,
        feedBack,
        setFeedBack,
        totalNotification,
        setTotalNotification,
        countCalender, setCountCalendar
      }}
    >
      {children}
    </State.Provider>
  );
};

export default Context;
