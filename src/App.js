import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useAuth } from "./context/AuthContext";

// User
import Home from "./page/User/HomePage/Home";
import { State } from "./state/context";
import Docter from "./page/Doctor/DocterPage/pagination/Docter";
import Clinic from "./page/User/ClinicPage/Clinic";
import Question from "./page/User/QuestionPage/Question";
import Blog from "./page/User/BlogPage/Blog";
import Security from "./page/User/SecurityPage/Security";
import Confirm from "./page/User/ConfirmPage/Confirm";
import DetailClinic from "./page/User/DetailPage/DetailClinic";
import Opacity from "./components/OpacityComponent/Opacity";
import NotFound from "./components/NotFoundComponent/NotFound";
import Booking from "./page/User/BookingPage/Booking";
import HistoryBooking from "./page/User/HistoryBookingPage/HistoryBooking";
import Profiles from "./page/User/ProfilePage/Profile";
import AppointmentList from "./page/User/BookingStatus/AppointmentList";
import SearchClinic from "./page/User/SearchClinicPage/SearchClinic";
import CreateClinic from "./page/User/SigupClinicPage/CreateClinic";
import CallDocter from "./page/User/CallDocterPage/CallDocter";
import DetailDocter from "./page/User/DetailPage/DetailDocter";

// Doctor
import Layout from "./layouts/LayoutsDoctor/Layout/Layout";
import Login from "./page/Doctor/DocterPage/Login/index";
import PatientManagementv2 from "./page/Doctor/DocterPage/PatientManagementv2/index";
import ScheduleAppointment from "./page/Doctor/DocterPage/ScheduleMedicalAppointment/index";
import PatientDetail from "./page/Doctor/DocterPage/PatientManagementv2/PatientDetail/index";
import PatientEdit from "./page/Doctor/DocterPage/PatientManagementv2/PatientEdit/index";
import ViewMedicalRecords from "./page/Doctor/DocterPage/ViewMedicalAppointmentSchedule/index.jsx";
import MedicalHistory from "./page/Doctor/DocterPage/PatientManagementv2/MedicalHistory/index";
import AcceptMedicalAppointment from "./page/Doctor/DocterPage/AcceptMedicalAppointment/index";
import QnA from "./page/Doctor/DocterPage/QnA/index";
import Invoice from "./page/Doctor/DocterPage/Invoice/index";
import DoctorStatistics from "./page/Doctor/DocterPage/DoctorStatistics/index";
import Revenue from "./page/Doctor/DocterPage/DoctorStatistics/Revenue/index";
import Visits from "./page/Doctor/DocterPage/DoctorStatistics/Visits/index";
import Profile from "./page/Doctor/DocterPage/Profile/index";
import EditProfile from "./page/Doctor/DocterPage/Profile/EditProfile/index";
import OnlineConsult from "./page/Doctor/DocterPage/OnlineConsult/index";
import ForgotPassword from "./page/Doctor/DocterPage/ForgotPassword/index";
import { PatientProvider } from "./context/patientContext";

// Clinic
import { CommonProvider } from "./components/CommonContext";
import LayoutClinic from "./layouts/LayoutClinic/Layout/LayoutClinic.jsx";
import MNDoctorAll from "./page/Clinic/DoctorAllPage/MNDoctorAll.jsx";
import MNSchedules from "./page/Clinic/ClinicSchedule/ClinicScheduleManager.jsx";
import NotificationClinic from "./page/Clinic/NotificationPage/NotificationManager.jsx";
import NewsManager from "./page/Clinic/NewEditerPage/NewsManager.jsx";
import UpdateClinic from "./page/Clinic/UpdateClinicPage/UpdateClinic.jsx";
import StatisticalClinic from "./page/Clinic/StatisticalPage/Statistical.js";
import DashBoard from "./page/Clinic/DashBoard/Dashboard.jsx";
import Changepassword from "./page/Changepassword/Changepassword.jsx";
import MNSpecialty from "./page/Clinic/MNSpecialtyPage/MNSpecialty.jsx";
import ClinicView from "./page/Clinic/ProfileClinicPage/ClinicView.jsx";

// admin system
import ClinicRequestManagement from "./page/AdminSystem/ClinicBrowse/ClinicRequestManagement.jsx";
import ClinicManagers from "./page/AdminSystem/ClinicSystem/ClinicManagers.jsx";
import NotificationManager from "./page/AdminSystem/notification/NotificationManager.jsx";
import PackageManager from "./page/AdminSystem/package/PackageManager.jsx";
import OrganizationProfile from "./page/AdminSystem/profile/OrganizationProfile.jsx";
import Statistical from "./page/AdminSystem/statistical/Statistical.jsx";
import LayoutAdmin from "./layouts/LayoutSystem/Layout/Layout.jsx";
// import AuthGuard from "./components/AuthGuardComponent/AuthGuard.jsx";
// import LoginSuccess from "./page/User/LoginCuccessForGG/LoginCuccess.jsx";
import Registration from "./page/Doctor/DocterPage/Regester/Registration.js";
import RegionSelection from "./page/User/RegionSelection/RegionSelection.jsx";
// import AIChatBox from "./ai/AIChatBox.jsx";
import NotificationDetail from "./page/User/Notification/Notification.jsx";
import ChangePass from "./page/User/ChangePass/ChangePass.jsx";
import NewsDetail from "./page/User/NewsDetail/NewsDetail.jsx";
// import Newss from "./page/User/NewsPage/Newss.jsx";
import FloatingChatBubble from "./components/FloatingChatBubble/FloatingChatBubble.jsx";
import ChatPage from "./components/Chat/ChatPage.jsx";
import AIChatBox from "./ai/AIChatBox.jsx";
import BookingGuide from "./page/User/BookingGuide/BookingGuide.jsx";
import Newss from "./page/User/NewsPage/Newss.jsx";
import AuthGuard from "./components/AuthGuardComponent/AuthGuard.jsx";
import LoginSuccess from "./page/User/LoginCuccessForGG/LoginCuccess.jsx";
import Loading from "./components/LoadingComponent/Loading.js";

function App() {
  const { valueText, roleLocal, loading } = useContext(State);
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  // const [role, setRole] = useState("");
  const location = useLocation()
  // const storedRole = localStorage.getItem("role");
  const { user, loading: authLoading } = useAuth();
  // const currentRole = user?.rawRole || localStorage.getItem("role") || "TD";
  const [currentRole, setCurrentRole] = useState(
    localStorage.getItem("role") || "TD"
  );
  useEffect(() => {

    if (location.pathname === "/login-success") {
      return;
    }
    const role = localStorage.getItem("role") || "TD";
    setCurrentRole(role);

  }, [location.pathname]);

  useEffect(() => {
    // if (role === "BenhNhan" || role === "TD") {
    //   import("./userOnly.css");
    // }
    if (currentRole === "BenhNhan" || currentRole === "TD") {
      import("./userOnly.css");
    }
  }, [currentRole]);

  useEffect(() => {
    if (currentRole === "BacSi" || currentRole === "PhongKham" || currentRole === "Admin") {
      setLoadingDoctor(true);
      const timer = setTimeout(() => {
        setLoadingDoctor(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentRole]);
  const hideChatBoxPaths = [
    "/login",
    "/register",
    "/forgotPassword",
    "/login-success",
    "/"
  ];

  const shouldHideChat = hideChatBoxPaths.includes(location.pathname);

  if (authLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải hệ thống...</div>;
  }


  const needLoading =
    currentRole === "BacSi" ||
    currentRole === "PhongKham" ||
    currentRole === "Admin";

  if (needLoading && loadingDoctor) {
    return <Loading />;
  }

  return (
    <>
      <CommonProvider>
        <PatientProvider>
          {valueText.length > 0 && <Opacity />}
          {!shouldHideChat && currentRole === "BenhNhan" && <AIChatBox />}
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            {/* User */}
            {(currentRole == "BenhNhan" || currentRole == "TD") && (
              <>

                <Route path="/trang-chu" element={<Home />} />
                <Route path="/bac-si" element={<Docter />} />
                <Route path="/bac-si/page/:page" element={<Docter />} />
                <Route path="/phong-kham" element={<Clinic />} />
                <Route path="/phong-kham/page/:page" element={<Clinic />} />
                <Route path="/tu-van" element={<AuthGuard role={currentRole}><Question /></AuthGuard>} />
                <Route path="/tu-van/page/:page" element={<AuthGuard role={currentRole}><Question /></AuthGuard>} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/chinh-sach-bao-mat" element={<Security />} />
                <Route path="/confirm" element={<Confirm />} />
                <Route path="/patient/chat" element={<ChatPage />} />
                <Route path="/dang-ky-phong-kham" element={<AuthGuard role={currentRole}><CreateClinic /></AuthGuard>} />
                <Route path="/:id/dat-lich-kham" element={<AuthGuard role={currentRole}><Booking /></AuthGuard>} />
                <Route path="/lich-su-kham-benh" element={<HistoryBooking />} />
                <Route path="/trang-ca-nhan" element={<AuthGuard role={currentRole}><Profiles /></AuthGuard>} />
                <Route path="/xem-lich-kham" element={<AuthGuard role={currentRole}><AppointmentList /> </AuthGuard>} />
                <Route path="/thong-bao/:id" element={<AuthGuard role={currentRole}><NotificationDetail /> </AuthGuard>} />
                <Route path="/kham-lam-san" element={<AuthGuard role={currentRole}><CallDocter /></AuthGuard>} />
                <Route path="/doi-mat-khau" element={<AuthGuard role={currentRole}><ChangePass /></AuthGuard>} />
                <Route path="/chon-tinhthanh" element={<RegionSelection />} />
                <Route path="/tin-tuc/xem-chi-tiet/:id" element={<NewsDetail />} />
                <Route path="/chi-tiet-phong-kham/:id" element={<DetailClinic />} />
                <Route path="/tim-kiem-chuyen-khoa" element={<SearchClinic />} />
                <Route path="/tim-kiem-chuyen-khoa/page/:page" element={<SearchClinic />} />
                <Route path="/huong-dan-he-thong" element={<BookingGuide />} />
                <Route path="/tin-tuc" element={<Newss />} />
                <Route path="/tin-tuc/:id" element={<Newss />} />
                <Route path="/tin-tuc/:id/page/:page" element={<Newss />} />
                <Route path="/tin-tuc/page/:page" element={<Newss />} />
                <Route path="/xem-chi-tiet-bac-si/:id" element={<DetailDocter />} />
                <Route path="/*" element={<NotFound />} />
              </>
            )}
            {/* Doctor */}
            {currentRole === "BacSi" && (
              <>
                <Route path="/doctor" element={<Layout />}>
                  <Route path="/doctor/patients" element={<PatientManagementv2 />} />
                  <Route path="/doctor/patient-detail/:id" element={<PatientDetail />}></Route>
                  <Route path="/doctor/Patients/Detail/:maBenhNhan" element={<PatientDetail />} />
                  <Route path="/doctor/doi-mat-khau" element={<ChangePass />} />
                  <Route path="/doctor/chat" element={<ChatPage />} />
                  <Route path="/doctor" element={<DoctorStatistics />} />
                  <Route path="/doctor/schedule" element={<ScheduleAppointment />} />
                  <Route path="/doctor/View" element={<ViewMedicalRecords />} />
                  <Route path="/doctor/Accept" element={<AcceptMedicalAppointment />} />
                  <Route path="/doctor/QnA" element={<QnA />} />
                  <Route path="/doctor/Invoice" element={<Invoice />} />
                  <Route path="/doctor/OnlineConsult" element={<OnlineConsult />} />
                  <Route path="/doctor/DoctorStatistics" element={<DoctorStatistics />} />
                  <Route path="/doctor/DoctorStatistics/Revenue" element={<Statistical />} />
                  <Route path="DoctorStatistics/Visits" element={<Visits />} />
                  <Route path="Profile" element={<Profile />} />
                  <Route path="Profile/EditProfile" element={<EditProfile />} />
                  <Route path="ForgotPassword" element={<ForgotPassword />} />
                </Route>
                <Route path="/*" element={<NotFound />} />
              </>
            )}
            {/* Admin system*/}
            {currentRole === "Admin" && (
              <>
                <Route path="/admin" element={<LayoutAdmin />}>
                  <Route index element={<Statistical />} />
                  <Route path="profile" element={<OrganizationProfile />} />
                  <Route path="duyet-phong-kham" element={<ClinicRequestManagement />} />
                  <Route path="quan-ly-phong-kham" element={<ClinicManagers />} />
                  <Route path="quan-ly-thong-bao" element={<NotificationManager />} />
                  <Route path="quan-ly-goi-dang-ky" element={<PackageManager />} />
                  <Route path="thong-ke-bao-cao/" element={<Statistical />} />
                  <Route path="doi-mat-khau" element={<ChangePass />} />
                </Route>
                <Route path="/*" element={<NotFound />} />
              </>
            )}
            {/* clinic */}
            {currentRole === "PhongKham" && (
              <>
                <Route path="/clinic" element={<LayoutClinic />}>
                  <Route index element={<StatisticalClinic />} />
                  <Route path="thong-tin-phong-kham" element={<ClinicView />} />
                  <Route path="quan-ly-bac-si" element={<MNDoctorAll />} />
                  <Route path="quan-ly-chuyen-khoa" element={<MNSpecialty />} />
                  <Route path="lich-lam-viec" element={<MNSchedules />} />
                  {/* <Route path="quan-ly-lich-kham" element={<MNSpecialty />}/> */}
                  <Route path="quan-ly-thong-bao" element={<NotificationClinic />} />
                  <Route path="quan-ly-tin-tuc" element={<NewsManager />} />
                  <Route path="thong-ke-bao-cao" element={<StatisticalClinic />} />
                  <Route path="doi-mat-khau" element={<ChangePass />} />
                </Route>
                <Route path="/*" element={<NotFound />} />
              </>
            )}

          </Routes>
          <FloatingChatBubble />
          <ToastContainer />
        </PatientProvider>
      </CommonProvider>
    </>
  );
}

export default App;
