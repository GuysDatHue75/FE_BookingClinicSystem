import styles from "./Button.module.css";
import { Link, useNavigate } from "react-router-dom";
const Button = ({ login, booking, title, path, idDocter }) => {
  const navigate = useNavigate();
  const handelBooking = () => {
    localStorage.setItem("idDocter",idDocter);
    navigate(path);
  };
  // const handelViewDetailDocter = () => {
  //   localStorage.setItem("idDocter", JSON.stringify(idDocter));
  //   navigate(path);
  // };
  return !booking ? (
    <Link to={login ? "/login" : "/register"} className={styles.cpmButton}>{login ? "Đăng nhập" : "Đăng ký"}</Link>
  ) : (
    <button
      className={title ? `${styles.btnBookingDocter}` : `${styles.btnViewMore}`}
      onClick={handelBooking}
    >
      {title ? "Đặt lịch khám" : "Xem chi tiết"}
    </button>
  );
};

export const ViewMore = ({ path }) => (
  <Link to={path} className={styles.cpmViewMore}>
    Xem thêm
  </Link>
);
export const BookingHome = ({path}) => (
  <Link className={styles.bookingHome} to={path}>Đặt lịch ngay</Link>
);

export const Advise = ({ path }) => (
    <Link className={styles.adviseHome} to={path}>Tư vấn ngay</Link>
);

export const Exit = ({ name, className, clickExit, handelShowMessage }) => (
  <button
    className={styles[className]}
    onClick={name === "Thoát" ? clickExit : handelShowMessage}
  >
    {name}
  </button>
);

export default Button;
