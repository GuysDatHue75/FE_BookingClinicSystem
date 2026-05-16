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
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon-wrapper">

          <img src="/logo.svg" alt="Doctor Online Connect Logo" className="sidebar-logo-img" />
        </div>

      </div>

      {/* KHU VỰC MENU CHÍNH */}
      <div className="sidebar-menu">
        {menuItems.map((item, idx) => (
          <div key={idx} className="menu-group">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "menu-item active-item" : "menu-item"
              }
            >
              <div className="item-left">
                <span className="menu-icon">
                  {/* Bỏ {item.icon} vào trong thẻ img */}
                  <img src={item.icon} alt={item.label} className="icon-img" />
                </span>
                <span className="menu-label">{item.label}</span>
              </div>

              {/* Badge thông báo (nếu có) */}
              {item.noti > 0 && <span className="noti-badge">{item.noti}</span>}
            </NavLink>

            {/* RENDER MENU CON (SUB-MENU) */}
            {item.subMenu && isMenuOpen(item) && (
              <div className="sub-menu-container">
                {item.subMenu.map((sub, subIdx) => (
                  <NavLink
                    key={subIdx}
                    to={sub.path}
                    className={({ isActive }) =>
                      isActive ? "sub-menu-item active-sub" : "sub-menu-item"
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