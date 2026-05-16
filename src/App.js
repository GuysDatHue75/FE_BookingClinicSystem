import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

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
import SidebarClinic from "./layouts/LayoutClinic/SidebarClinic";
import CreateDoctor from "./page/Clinic/CreateDoctorPage/CreateDoctor";
import MNDoctorAll from "./page/Clinic/DoctorAllPage/MNDoctorAll";
import DoctorView from "./page/Clinic/DoctorViewPage/DoctorView.js";
import NotificationEditor from "./page/Clinic/NotificationPage/NotificationEditer.js";
import NewsEditor from "./page/Clinic/NewEditerPage/NewsEditor.js";
import UpdateClinic from "./page/Clinic/UpdateClinicPage/UpdateClinic.js";
import Statistics from "./page/Clinic/StatisticalPage/Statistical.js";
import Changepassword from "./page/Changepassword/Changepassword.jsx";
import MNSpecialty from "./page/Clinic/MNSpecialtyPage/MNSpecialty.js";
import ClinicView from "./page/Clinic/ProfileClinicPage/ClinicView.js";

// admin system
import Clinicbrowses from "./page/Clinicbrowse/Clinicbrowses";
import Doctorbrowses from "./page/Doctorbrowse/Doctorbrowses";
import Clinicmanagers from "./page/Clinicmanager/Clinicmanagers";
import Createpackage from "./page/package/createpackage/Createpackage";
import UserProfile from "./page/profile/Userprofile";
import Statistical from "./page/statistical/Statistical";
import SidebarAdmin from "./layouts/Sidebar/Sidebar.jsx";
import Registration from "./page/Doctor/DocterPage/Regester/Registration.js";
import AuthGuard from "./components/AuthGuardComponent/AuthGuard.jsx";
import LoginSuccess from "./page/User/LoginCuccessForGG/LoginCuccess.jsx";
import RegionSelection from "./page/User/RegionSelection/RegionSelection.jsx";
import AIChatBox from "./ai/AIChatBox.jsx";
import NotificationDetail from "./page/User/Notification/Notification.jsx";
import ChangePass from "./page/User/ChangePass/ChangePass.jsx";
import NewsDetail from "./page/User/NewsDetail/NewsDetail.jsx";
import Newss from "./page/User/NewsPage/Newss.jsx";
function App() {
  const { valueText, roleLocal, loading } = useContext(State);
  const [role, setRole] = useState('');
  const location = useLocation()
  const storedRole = localStorage.getItem("role");
  
  useEffect(() => {
    if (storedRole) {
      setRole(storedRole);
      return;
    }
    if (location.pathname === "/login-success") {
      return;
    }

    localStorage.setItem("role", "TD");
    setRole("TD");

  }, [location.pathname]);

  useEffect(() => {
    if (role === "BenhNhan" || role === "TD") {
      import("./userOnly.css");
    }
  }, [role]);
  const hideChatBoxPaths = [
    "/login",
    "/register",
    "/forgotPassword",
    "/login-success",
    "/"
  ];

  const shouldHideChat = hideChatBoxPaths.includes(location.pathname);

  return (
    <>
      <CommonProvider>
        <PatientProvider>
          {valueText.length > 0 && <Opacity />}
          {!shouldHideChat && storedRole === "BenhNhan" && <AIChatBox />}
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            {/* User */}
            {(role == "BenhNhan" || role == "TD") && (
              <>

                <Route path="/trang-chu" element={<Home />} />
                <Route path="/bac-si" element={<Docter />} />
                <Route path="/bac-si/page/:page" element={<Docter />} />
                <Route path="/phong-kham" element={<Clinic />} />
                <Route path="/phong-kham/page/:page" element={<Clinic />} />
                <Route path="/tu-van" element={<AuthGuard role={role}><Question /></AuthGuard>} />
                <Route path="/tu-van/page/:page" element={<AuthGuard role={role}><Question /></AuthGuard>} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/chinh-sach-bao-mat" element={<Security />} />
                <Route path="/confirm" element={<Confirm />} />
                <Route path="/dang-ky-phong-kham" element={<AuthGuard role={role}><CreateClinic /></AuthGuard>} />
                <Route path="/:id/dat-lich-kham" element={<AuthGuard role={role}><Booking /></AuthGuard>} />
                <Route path="/lich-su-kham-benh" element={<HistoryBooking />} />
                <Route path="/trang-ca-nhan" element={<AuthGuard role={role}><Profiles /></AuthGuard>} />
                <Route path="/xem-lich-kham" element={<AuthGuard role={role}><AppointmentList /> </AuthGuard>} />
                <Route path="/thong-bao/:id" element={<AuthGuard role={role}><NotificationDetail /> </AuthGuard>} />
                <Route path="/kham-lam-san" element={<AuthGuard role={role}><CallDocter /></AuthGuard>} />
                <Route path="/doi-mat-khau" element={<AuthGuard role={role}><ChangePass /></AuthGuard>} />
                <Route path="/chon-tinhthanh" element={<RegionSelection />} />
                <Route path="/tin-tuc/xem-chi-tiet/:id" element={<NewsDetail />} />
                <Route
                  path="/chi-tiet-phong-kham/:id"
                  element={<DetailClinic />}
                />
                <Route path="/tim-kiem-chuyen-khoa" element={<SearchClinic />} />
                <Route path="/tim-kiem-chuyen-khoa/page/:page" element={<SearchClinic />} />
                <Route path="/tin-tuc" element={<Newss />} />
                <Route path="/tin-tuc/:id" element={<Newss />} />
                <Route path="/tin-tuc/:id/page/:page" element={<Newss />} />
                <Route path="/tin-tuc/page/:page" element={<Newss />} />


                <Route
                  path="/xem-chi-tiet-bac-si/:id"
                  element={<DetailDocter />}
                />
                <Route path="/*" element={<NotFound />} />
              </>
            )}
            {/* Doctor */}
            {role === "BacSi" && (
              <>
                <Route path="/doctor" element={<Layout />}>
                  <Route
                    path="/doctor/patients"
                    element={<PatientManagementv2 />}
                  />
                  <Route
                    path="/doctor/doi-mat-khau"
                    element={<Changepassword />}
                  />
                  <Route path="/doctor" element={<DoctorStatistics />} />
                  <Route
                    path="/doctor/schedule"
                    element={<ScheduleAppointment />}
                  />
                  <Route path="/doctor/View" element={<ViewMedicalRecords />} />
                  <Route
                    path="/doctor/Accept"
                    element={<AcceptMedicalAppointment />}
                  />
                  <Route path="/doctor/QnA" element={<QnA />} />
                  <Route path="/doctor/Invoice" element={<Invoice />} />
                  <Route
                    path="/doctor/OnlineConsult"
                    element={<OnlineConsult />}
                  />
                  <Route
                    path="/doctor/DoctorStatistics"
                    element={<DoctorStatistics />}
                  />
                  <Route
                    path="/doctor/DoctorStatistics/Revenue"
                    element={<Statistical />}
                  />
                  <Route path="DoctorStatistics/Visits" element={<Visits />} />
                  <Route path="Profile" element={<Profile />} />
                  <Route path="Profile/EditProfile" element={<EditProfile />} />
                  <Route path="ForgotPassword" element={<ForgotPassword />} />
                </Route>
                <Route path="/*" element={<NotFound />} />
              </>
            )}
            {/* Admin system*/}
            {role === "PhongKham" && (
              <>
                <Route
                  path="/admin"
                  element={
                    <SidebarAdmin>
                      <Statistical />
                    </SidebarAdmin>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <SidebarAdmin>
                      <UserProfile />
                    </SidebarAdmin>
                  }
                />
                <Route
                  path="/duyet-phong-kham"
                  element={
                    <SidebarAdmin>
                      <Clinicbrowses />
                    </SidebarAdmin>
                  }
                />
                <Route
                  path="/duyet-bac-si"
                  element={
                    <SidebarAdmin>
                      <Doctorbrowses />
                    </SidebarAdmin>
                  }
                />
                <Route
                  path="/quan-ly-phong-kham"
                  element={
                    <SidebarAdmin>
                      <Clinicmanagers />
                    </SidebarAdmin>
                  }
                />
                <Route
                  path="/viet-thong-bao"
                  element={
                    <SidebarAdmin>
                      <NotificationEditor />
                    </SidebarAdmin>
                  }
                />
                <Route
                  path="/quan-ly-goi/tao-goi"
                  element={
                    <SidebarAdmin>
                      <Createpackage />
                    </SidebarAdmin>
                  }
                />
                <Route
                  path="/thong-ke-bao-cao"
                  element={
                    <SidebarAdmin>
                      <Statistical />
                    </SidebarAdmin>
                  }
                />
                <Route
                  path="/doi-mat-khau"
                  element={
                    <SidebarAdmin>
                      <Changepassword />
                    </SidebarAdmin>
                  }
                />
              </>
            )}
            {/* clinic */}
            {role === "Admin" && (
              <>
                <Route
                  path="/clinic"
                  element={
                    <SidebarClinic>
                      <Statistics />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/createDoctor"
                  element={
                    <SidebarClinic>
                      <CreateDoctor />
                    </SidebarClinic>
                  }
                />

                <Route
                  path="/clinic/doctorAll"
                  element={
                    <SidebarClinic>
                      <MNDoctorAll />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/doctorView/:slug"
                  element={
                    <SidebarClinic>
                      <DoctorView />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/createDoctor"
                  element={
                    <SidebarClinic>
                      <CreateDoctor />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/notification"
                  element={
                    <SidebarClinic>
                      <NotificationEditor />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/NewsEditor"
                  element={
                    <SidebarClinic>
                      <NewsEditor />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/updateClinic"
                  element={
                    <SidebarClinic>
                      <UpdateClinic />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/statistical"
                  element={
                    <SidebarClinic>
                      <Revenue />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/doi-mat-khau"
                  element={
                    <SidebarClinic>
                      <Changepassword />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/specialty"
                  element={
                    <SidebarClinic>
                      <MNSpecialty />
                    </SidebarClinic>
                  }
                />
                <Route
                  path="/clinic/profile"
                  element={
                    <SidebarClinic>
                      <ClinicView />
                    </SidebarClinic>
                  }
                />
                <Route path="/*" element={<NotFound />} />
              </>
            )}
          </Routes>

          <ToastContainer />
        </PatientProvider>
      </CommonProvider>
    </>
  );
}

export default App;
