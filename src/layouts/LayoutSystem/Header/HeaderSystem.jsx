// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import styles from "./HeaderSystem.module.css";

// // IMPORT CÁC FILE SVG VÀO ĐÂY:
// import caiDatIcon from "../../../assets/svg/CaiDat.svg";
// import thongBaoIcon from "../../../assets/svg/Chuong.svg";
// import Avatar from "../../../assets/image/avt.jpg";
// import menuIcon from "../../../assets/svg/menu.svg";

// // 💥 IMPORT CẢ 2 SERVICE (ĐỂ DÙNG CHUNG CHO CẢ 2 ROLE)
// import clinicNotificationService from "../../../services/clinic/NottificationService"; 
// import adminNotificationService from "../../../services/admin/NotificationService"; 

// const Header = ({ urlImage, user }) => { 
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0); 
  
//   const [showNotiDropdown, setShowNotiDropdown] = useState(false);
//   const [notiList, setNotiList] = useState([]);
//   const [notiTab, setNotiTab] = useState("all"); 
  
//   const location = useLocation(); 
//   const navigate = useNavigate(); 
//   const notiRef = useRef(null); 

//   // 💥 XÁC ĐỊNH ROLE ĐANG ĐĂNG NHẬP
//   const vaiTro = localStorage.getItem("role") || user?.account?.vaiTro;
//   const isAdmin = vaiTro === "Admin" || vaiTro === "ADMIN";

//   const handleGoToChangePassword = () => {
//     setShowDropdown(false);
//     navigate("/admin/doi-mat-khau");
//   };

//   const IMAGE_BASE_URL = "http://localhost:8080";
//   const getAvatarUrl = (media) => {
//     if (!media) return Avatar; 
//     if (media.startsWith("http") || media.startsWith("data:image")) return media;
//     return media.startsWith("/") ? `${IMAGE_BASE_URL}${media}` : `${IMAGE_BASE_URL}/${media}`;
//   };

//   // 1. Hàm đếm số lượng chưa đọc (Chỉ Phòng Khám mới có)
//   const fetchUnreadCount = async () => {
//     try {
//       if (isAdmin) {
//         setNotificationCount(0); // Admin chỉ đi gửi, ko có TB đến
//         return;
//       }
//       const maTK = localStorage.getItem("idAccount");
//       if (maTK) {
//         const res = await clinicNotificationService.getUnreadCount(maTK);
//         setNotificationCount(res || 0);
//       }
//     } catch (error) {
//       console.error("Lỗi đếm thông báo:", error);
//     }
//   };

//   // 2. Hàm lấy danh sách Dropdown tự động rẽ nhánh
//   const fetchNotificationList = async (isUnreadOnly = false) => {
//     try {
//       const maTK = localStorage.getItem("idAccount");
//       if (!maTK) return;

//       const payload = {
//         maTaiKhoan: maTK,
//         page: 0,
//         size: 10, 
//         sortBy: "thoiGianGui",
//         sortDirection: "desc",
//         isRead: isUnreadOnly ? false : null 
//       };

//       let res;
//       if (isAdmin) {
//         // Nếu là Admin -> Lấy danh sách lịch sử ĐÃ GỬI
//         res = await adminNotificationService.searchNotification(payload);
//       } else {
//         // Nếu là Phòng Khám -> Lấy danh sách ĐÃ NHẬN
//         res = await clinicNotificationService.searchReceivedNotifications(payload);
//       }
      
//       const data = res.data || res;
//       setNotiList(data.content || []);
//     } catch (error) {
//       console.error("Lỗi lấy danh sách thông báo:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUnreadCount();
//   }, []);

//   useEffect(() => {
//     if (showNotiDropdown) {
//       fetchNotificationList(notiTab === "unread");
//     }
//   }, [notiTab, showNotiDropdown]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notiRef.current && !notiRef.current.contains(event.target)) {
//         setShowNotiDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const timeAgo = (dateString) => {
//     if (!dateString) return "";
//     const now = new Date();
//     const past = new Date(dateString);
//     const diffInMinutes = Math.floor((now - past) / 60000);
    
//     if (diffInMinutes < 1) return "Vừa xong";
//     if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
//     return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
//   };

//   const handleNotiClick = async (item) => {
//     // Nếu chưa đọc và KHÔNG PHẢI ADMIN thì gọi API đánh dấu đã đọc
//     if (!isAdmin && (item.isRead === false || item.isRead === null)) {
//       try {
//         const maTK = localStorage.getItem("idAccount");
//         await clinicNotificationService.markAsRead(item.maThongBao, maTK);
//         setNotiList(prev => prev.map(n => n.maThongBao === item.maThongBao ? { ...n, isRead: true } : n));
//         setNotificationCount(prev => Math.max(0, prev - 1));
//       } catch (error) {
//         console.error("Lỗi đánh dấu đã đọc:", error);
//       }
//     }
//     setShowNotiDropdown(false);
//   };

//   const handleLogout = () => {
//     setShowDropdown(false);
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <header className={styles['header-container']}>
//       <div className={styles['header-left']}>
//         <button className={styles['header-btn']} title="Menu">
//           <img src={menuIcon} alt="Menu" className={styles['header-icon-img']} />
//         </button>
//       </div>

//       <div className={styles['header-right']}>
//         <button className={styles['header-btn']} title="Cài đặt">
//           <img src={caiDatIcon} alt="Cài đặt" className={styles['header-icon-img']} />
//         </button>

//         <div className={styles['noti-wrapper']} ref={notiRef}>
//           <button 
//             className={`${styles['header-btn']} ${styles['notification-btn']}`} 
//             title="Thông báo"
//             onClick={() => {
//               setShowNotiDropdown(!showNotiDropdown);
//               setShowDropdown(false);
//             }}
//           >
//             <img src={thongBaoIcon} alt="Thông báo" className={styles['header-icon-img']} />
//             {notificationCount > 0 && (
//               <span className={styles['noti-badge-header']}>{notificationCount}</span>
//             )}
//           </button>

//           {showNotiDropdown && (
//             <div className={styles['noti-dropdown']}>
//               <div className={styles['noti-header']}>
//                 <h3>{isAdmin ? "Lịch sử đã gửi" : "Thông báo"}</h3>
//                 {/* Admin không cần tab Chưa đọc vì chỉ xem lịch sử gửi */}
//                 {!isAdmin && (
//                   <div className={styles['noti-tabs']}>
//                     <span 
//                       className={notiTab === "all" ? styles['noti-tab-active'] : styles['noti-tab']}
//                       onClick={() => setNotiTab("all")}
//                     >
//                       Tất cả
//                     </span>
//                     <span 
//                       className={notiTab === "unread" ? styles['noti-tab-active'] : styles['noti-tab']}
//                       onClick={() => setNotiTab("unread")}
//                     >
//                       Chưa đọc
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <div className={styles['noti-body']}>
//                 <div className={styles['noti-group-title']}>Gần đây</div>
//                 {notiList.length > 0 ? (
//                   notiList.map(item => (
//                     <div 
//                       key={item.maThongBao} 
//                       className={styles['noti-item']}
//                       onClick={() => handleNotiClick(item)}
//                     >
//                       <img src={getAvatarUrl(item.anhThongBao)} alt="icon" className={styles['noti-avatar']} />
//                       <div className={styles['noti-content']}>
//                         <p className={styles['noti-title']}>{item.tieuDe}</p>
//                         <span className={styles['noti-time']}>{timeAgo(item.thoiGianGui)}</span>
//                       </div>
//                       {(!isAdmin && (item.isRead === false || item.isRead === null)) && (
//                         <div className={styles['noti-unread-dot']}></div>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
//                     Không có thông báo nào.
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className={styles['avatar-wrapper']}>
//           <div
//             className={styles['header-avatar-box']}
//             onClick={() => {
//               setShowDropdown(!showDropdown);
//               setShowNotiDropdown(false);
//             }}
//           >
//             <img src={urlImage || Avatar} alt="Avatar" className={styles['avatar-img-round']} />
//           </div>

//           {showDropdown && (
//             <div className={styles['avatar-dropdown']}>
//               <div className={styles['dropdown-info']}>
//                 <strong>{user?.fullName || "Quản trị viên"}</strong>
//                 <span>{user?.account?.vaiTro || "Admin"}</span>
//               </div>
//               <hr />
//               <button className={styles['dropdown-item']} onClick={handleGoToChangePassword}>
//                 <i className="fa-solid fa-key"></i> Đổi mật khẩu
//               </button>
//               <button className={`${styles['dropdown-item']} ${styles.logout}`} onClick={handleLogout}>
//                 <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./HeaderSystem.module.css";

// IMPORT CÁC FILE SVG VÀO ĐÂY:
import caiDatIcon from "../../../assets/svg/CaiDat.svg";
import thongBaoIcon from "../../../assets/svg/Chuong.svg";
import Avatar from "../../../assets/image/avt.jpg";
import menuIcon from "../../../assets/svg/menu.svg";

// IMPORT SERVICE (DÙNG CHUNG CHO CẢ 2 ROLE)
import clinicNotificationService from "../../../services/clinic/NottificationService"; 
import adminNotificationService from "../../../services/admin/NotificationService"; 

// 🔥 IMPORT MODAL CHI TIẾT
// Bạn hãy kiểm tra lại đường dẫn (../) này xem đã trỏ đúng đến file NotificationDetailModal.jsx chưa nhé!
import NotificationDetailModal from "../../../page/Clinic/NotificationPage/NotificationDetailModal"; 

const Header = ({ urlImage, user }) => { 
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); 
  
  // CÁC STATE CHO DROPDOWN THÔNG BÁO
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const [notiList, setNotiList] = useState([]);
  const [notiTab, setNotiTab] = useState("all"); 
  
  // 🔥 CÁC STATE CHO MODAL XEM CHI TIẾT THÔNG BÁO TẠI HEADER
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const location = useLocation(); 
  const navigate = useNavigate(); 
  const notiRef = useRef(null); 

  // XÁC ĐỊNH ROLE ĐANG ĐĂNG NHẬP
  const vaiTro = localStorage.getItem("role") || user?.account?.vaiTro;
  const isAdmin = vaiTro === "Admin" || vaiTro === "ADMIN";

  const handleGoToChangePassword = () => {
    setShowDropdown(false);
    const role = localStorage.getItem("role");
    if(role === "Admin") {
    navigate("/admin/doi-mat-khau");
    } else {
      navigate("/clinic/doi-mat-khau");
    }
  };

  const IMAGE_BASE_URL = "http://localhost:8080";
  const getAvatarUrl = (media) => {
    if (!media) return Avatar; 
    if (media.startsWith("http") || media.startsWith("data:image")) return media;
    return media.startsWith("/") ? `${IMAGE_BASE_URL}${media}` : `${IMAGE_BASE_URL}/${media}`;
  };

  // 1. Hàm đếm số lượng chưa đọc (Chỉ Phòng Khám mới có)
  const fetchUnreadCount = async () => {
    try {
      if (isAdmin) {
        setNotificationCount(0); 
        return;
      }
      const maTK = localStorage.getItem("idAccount");
      if (maTK) {
        const res = await clinicNotificationService.getUnreadCount(maTK);
        setNotificationCount(res || 0);
      }
    } catch (error) {
      console.error("Lỗi đếm thông báo:", error);
    }
  };

  // 2. Hàm lấy danh sách Dropdown tự động rẽ nhánh
  const fetchNotificationList = async (isUnreadOnly = false) => {
    try {
      const maTK = localStorage.getItem("idAccount");
      if (!maTK) return;

      const payload = {
        maTaiKhoan: maTK,
        page: 0,
        size: 10, 
        sortBy: "thoiGianGui",
        sortDirection: "desc",
        isRead: isUnreadOnly ? false : null 
      };

      let res;
      if (isAdmin) {
        res = await adminNotificationService.searchNotification(payload);
      } else {
        res = await clinicNotificationService.searchReceivedNotifications(payload);
      }
      
      const data = res.data || res;
      setNotiList(data.content || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách thông báo:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (showNotiDropdown) {
      fetchNotificationList(notiTab === "unread");
    }
  }, [notiTab, showNotiDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNotiDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const timeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now - past) / 60000);
    
    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  // 🔥 HÀM XỬ LÝ CLICK VÀO ITEM THÔNG BÁO TRÊN CHUÔNG (ĐÃ NÂNG CẤP)
  const handleNotiClick = async (item) => {
    try {
      // 1. Gọi API lấy chi tiết thông báo đầy đủ (để lấy nội dung chi tiết, files, hình ảnh thực tế)
      let response;
      if (isAdmin) {
        response = await adminNotificationService.detailNotification(item.maThongBao);
      } else {
        response = await clinicNotificationService.detailNotification(item.maThongBao);
      }
      const resultData = response.data || response;
      
      // 2. Đổ dữ liệu vào State và bật Modal bật lên màn hình
      setDetailData(resultData);
      setShowDetailModal(true);

      // 3. Nếu chưa đọc và KHÔNG PHẢI ADMIN thì tiến hành đánh dấu đã đọc
      if (!isAdmin && (item.isRead === false || item.isRead === null)) {
        const maTK = localStorage.getItem("idAccount");
        await clinicNotificationService.markAsRead(item.maThongBao, maTK);
        
        // Cập nhật trạng thái hiển thị của item ngay tại chỗ không cần F5 trang
        setNotiList(prev => prev.map(n => n.maThongBao === item.maThongBao ? { ...n, isRead: true } : n));
        setNotificationCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết thông báo tại Header:", error);
      alert("Không thể tải chi tiết thông báo này!");
    } finally {
      setShowNotiDropdown(false); // Click xong đóng Dropdown chuông thông báo lại cho chuyên nghiệp
    }
  };

  // 🔥 HÀM XỬ LÝ XÓA THÔNG BÁO TRỰC TIẾP TỪ MODAL TRÊN HEADER (NẾU CÓ)
  const handleDeleteNotification = async (maThongBao) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này không? Hành động này không thể hoàn tác.")) {
      try {
        if (isAdmin) {
          await adminNotificationService.deleteNotification(maThongBao);
        } else {
          await clinicNotificationService.deleteNotification(maThongBao);
        }
        alert("Xóa thông báo thành công!");
        setShowDetailModal(false); // Xóa xong đóng modal
        
        // Refresh lại dữ liệu chuông thông báo
        fetchUnreadCount();
        fetchNotificationList(notiTab === "unread");
      } catch (error) {
        console.error("Lỗi khi xóa thông báo từ Header:", error);
        alert("Xóa thông báo thất bại, vui lòng thử lại!");
      }
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className={styles['header-container']}>
      <div className={styles['header-left']}>
        <button className={styles['header-btn']} title="Menu">
          <img src={menuIcon} alt="Menu" className={styles['header-icon-img']} />
        </button>
      </div>

      <div className={styles['header-right']}>
        <button className={styles['header-btn']} title="Cài đặt">
          <img src={caiDatIcon} alt="Cài đặt" className={styles['header-icon-img']} />
        </button>

        {/* NÚT CHUÔNG VÀ DROPDOWN THÔNG BÁO */}
        <div className={styles['noti-wrapper']} ref={notiRef}>
          <button 
            className={`${styles['header-btn']} ${styles['notification-btn']}`} 
            title="Thông báo"
            onClick={() => {
              setShowNotiDropdown(!showNotiDropdown);
              setShowDropdown(false);
            }}
          >
            <img src={thongBaoIcon} alt="Thông báo" className={styles['header-icon-img']} />
            {notificationCount > 0 && (
              <span className={styles['noti-badge-header']}>{notificationCount}</span>
            )}
          </button>

          {showNotiDropdown && (
            <div className={styles['noti-dropdown']}>
              <div className={styles['noti-header']}>
                <h3>{isAdmin ? "Lịch sử đã gửi" : "Thông báo"}</h3>
                {!isAdmin && (
                  <div className={styles['noti-tabs']}>
                    <span 
                      className={notiTab === "all" ? styles['noti-tab-active'] : styles['noti-tab']}
                      onClick={() => setNotiTab("all")}
                    >
                      Tất cả
                    </span>
                    <span 
                      className={notiTab === "unread" ? styles['noti-tab-active'] : styles['noti-tab']}
                      onClick={() => setNotiTab("unread")}
                    >
                      Chưa đọc
                    </span>
                  </div>
                )}
              </div>

              <div className={styles['noti-body']}>
                <div className={styles['noti-group-title']}>Gần đây</div>
                {notiList.length > 0 ? (
                  notiList.map(item => (
                    <div 
                      key={item.maThongBao} 
                      className={styles['noti-item']}
                      onClick={() => handleNotiClick(item)}
                    >
                      <img src={getAvatarUrl(item.anhThongBao)} alt="icon" className={styles['noti-avatar']} />
                      <div className={styles['noti-content']}>
                        <p className={styles['noti-title']}>{item.tieuDe}</p>
                        <span className={styles['noti-time']}>{timeAgo(item.thoiGianGui)}</span>
                      </div>
                      {(!isAdmin && (item.isRead === false || item.isRead === null)) && (
                        <div className={styles['noti-unread-dot']}></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                    Không có thông báo nào.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar Mini */}
        <div className={styles['avatar-wrapper']}>
          <div
            className={styles['header-avatar-box']}
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotiDropdown(false);
            }}
          >
            <img src={urlImage || Avatar} alt="Avatar" className={styles['avatar-img-round']} />
          </div>

          {showDropdown && (
            <div className={styles['avatar-dropdown']}>
              <div className={styles['dropdown-info']}>
                <strong>{user?.fullName || "Quản trị viên"}</strong>
                <span>{user?.account?.vaiTro || "Admin"}</span>
              </div>
              <hr />
              <button className={styles['dropdown-item']} onClick={handleGoToChangePassword}>
                <i className="fa-solid fa-key"></i> Đổi mật khẩu
              </button>
              <button className={`${styles['dropdown-item']} ${styles.logout}`} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 RENDER MODAL CHI TIẾT KHI ĐƯỢC KÍCH HOẠT TỪ CHUÔNG */}
      {showDetailModal && detailData && (
        <NotificationDetailModal 
          data={detailData} 
          onClose={() => setShowDetailModal(false)} 
          onDelete={handleDeleteNotification}
        />
      )}
    </header>
  );
};

export default Header;