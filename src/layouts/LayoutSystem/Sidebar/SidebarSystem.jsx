import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./SidebarSystem.module.css";

const Sidebar = ({ menuItems }) => {
  const location = useLocation();

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
      {/* FIX: Chuyển sang dạng ['kebab-case'] */}
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
              /* FIX: Kết hợp class động bằng Template String (` `) */
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

              {/* Badge thông báo (nếu có) */}
              {item.noti > 0 && <span className={styles['noti-badge']}>{item.noti}</span>}
            </NavLink>

            {/* RENDER MENU CON (SUB-MENU) */}
            {item.subMenu && isMenuOpen(item) && (
              <div className={styles['sub-menu-container']}>
                {item.subMenu.map((sub, subIdx) => (
                  <NavLink
                    key={subIdx}
                    to={sub.path}
                    /* FIX: Module hóa class Active cho menu con */
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