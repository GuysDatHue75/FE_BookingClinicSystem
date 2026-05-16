import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Sidebar from "../Sidebar/SidebarSystem";
import menuItems from "../Sidebar/SidebarMenuSystem";
import Header from "../Header/HeaderSystem";
import Footer from "../Footer/FooterSystem";

const Layout = () => {
    const {user} = useContext(AuthContext);
    return (
        <div className="layout-wrapper">
            {/* <Header urlImage={user?.avatar || ""} user={user} /> */}
            <Sidebar
                role={user?.roleName || "Khách"}
                name={user?.fullName || "Người dùng"}
                menuItems={menuItems}
                urlImage={user?.avatar || ""}
            />
            <div className="layout-content">
                <Header urlImage={user?.avatar || ""} user={user} />
                
                <main className="layout-main">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Layout;