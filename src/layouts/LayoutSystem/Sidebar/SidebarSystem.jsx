// import React from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import styles from "./SidebarSystem.module.css";

// const Sidebar = ({ menuItems }) => {
//   const location = useLocation();

//   // Logic kiểm tra xem menu con có đang được mở hay không
//   const isMenuOpen = (item) => {
//     if (item.subMenu) {
//       return (
//         item.path === location.pathname ||
//         item.subMenu.some((sub) => sub.path === location.pathname)
//       );
//     }
//     return false;
//   };

//   return (
//     <aside className={styles.sidebar}>
//       {/* FIX: Chuyển sang dạng ['kebab-case'] */}
//       <div className={styles['sidebar-logo']}>
//         <div className={styles['logo-icon-wrapper']}>
//           <img 
//             src="/logo.svg" 
//             alt="Doctor Online Connect Logo" 
//             className={styles['sidebar-logo-img']} 
//           />
//         </div>
//       </div>

//       {/* KHU VỰC MENU CHÍNH */}
//       <div className={styles['sidebar-menu']}>
//         {menuItems.map((item, idx) => (
//           <div key={idx} className={styles['menu-group']}>
//             <NavLink
//               to={item.path}
//               /* FIX: Kết hợp class động bằng Template String (` `) */
//               className={({ isActive }) =>
//                 isActive 
//                   ? `${styles['menu-item']} ${styles['active-item']}` 
//                   : styles['menu-item']
//               }
//             >
//               <div className={styles['item-left']}>
//                 <span className={styles['menu-icon']}>
//                   <img src={item.icon} alt={item.label} className={styles['icon-img']} />
//                 </span>
//                 <span className={styles['menu-label']}>{item.label}</span>
//               </div>

//               {/* Badge thông báo (nếu có) */}
//               {item.noti > 0 && <span className={styles['noti-badge']}>{item.noti}</span>}
//             </NavLink>

//             {/* RENDER MENU CON (SUB-MENU) */}
//             {item.subMenu && isMenuOpen(item) && (
//               <div className={styles['sub-menu-container']}>
//                 {item.subMenu.map((sub, subIdx) => (
//                   <NavLink
//                     key={subIdx}
//                     to={sub.path}
//                     /* FIX: Module hóa class Active cho menu con */
//                     className={({ isActive }) =>
//                       isActive 
//                         ? `${styles['sub-menu-item']} ${styles['active-sub']}` 
//                         : styles['sub-menu-item']
//                     }
//                   >
//                     {sub.label}
//                   </NavLink>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./SidebarSystem.module.css";

// 💥 IMPORT API SERVICE: (Nhớ kiểm tra lại đường dẫn cho chuẩn với thư mục của bạn nhé)
import browseClinicService from "../../../services/admin/BrowseClinicService"; 

const Sidebar = ({ menuItems }) => {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0); // 💥 State lưu số lượng chờ duyệt

  // 💥 HÀM GỌI API LẤY TỔNG SỐ PHÒNG KHÁM ĐANG CHỜ DUYỆT
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        // Gọi trang 0, size 1 để tối ưu hiệu năng (chỉ cần lấy metadata totalElements)
        const res = await browseClinicService.getPendingClinics(0, 1);
        
        // Spring Boot Page trả về tổng số bản ghi trong thuộc tính totalElements
        const count = res.totalElements || (res.data && res.data.totalElements) || 0;
        setPendingCount(count);
      } catch (error) {
        console.error("Lỗi lấy số lượng chờ duyệt:", error);
      }
    };

    fetchPendingCount();
  }, [location.pathname]); // 💥 Trick: Cứ mỗi lần Admin chuyển trang, tự động đếm lại cho số luôn mới!

  // Logic kiểm tra xem menu con có đang được mở hay không
  const isMenuOpen = (item) => {
    if (item.subMenu) {
      return (
        item.path === location.pathname ||
        item.subMenu.some((sub) => sub.path === location.pathname)
      );
    }
    return false;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles['sidebar-logo']}>
        <div className={styles['logo-icon-wrapper']}>
          <img 
            src="/logo.svg" 
            alt="Doctor Online Connect Logo" 
            className={styles['sidebar-logo-img']} 
          />
        </div>
      </div>

      {/* KHU VỰC MENU CHÍNH */}
      <div className={styles['sidebar-menu']}>
        {menuItems.map((item, idx) => (
          <div key={idx} className={styles['menu-group']}>
            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                isActive 
                  ? `${styles['menu-item']} ${styles['active-item']}` 
                  : styles['menu-item']
              }
            >
              <div className={styles['item-left']}>
                <span className={styles['menu-icon']}>
                  <img src={item.icon} alt={item.label} className={styles['icon-img']} />
                </span>
                <span className={styles['menu-label']}>{item.label}</span>
              </div>

              {/* 💥 KIỂM TRA: Nếu đúng là tab Duyệt phòng khám và có người chờ -> Bật chấm đỏ */}
              {item.path === "duyet-phong-kham" && pendingCount > 0 ? (
                 <span className={styles['noti-badge']}>{pendingCount}</span>
              ) : (
                 /* Giữ nguyên logic badge cũ nếu có menu nào khác cần hiển thị */
                 item.noti > 0 && <span className={styles['noti-badge']}>{item.noti}</span>
              )}
            </NavLink>

            {/* RENDER MENU CON (SUB-MENU) */}
            {item.subMenu && isMenuOpen(item) && (
              <div className={styles['sub-menu-container']}>
                {item.subMenu.map((sub, subIdx) => (
                  <NavLink
                    key={subIdx}
                    to={sub.path}
                    end
                    className={({ isActive }) =>
                      isActive 
                        ? `${styles['sub-menu-item']} ${styles['active-sub']}` 
                        : styles['sub-menu-item']
                    }
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;