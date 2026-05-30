import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import Sidebar from "../Sidebar/SidebarClinic";
import menuItems from "../Sidebar/SidebarMenuClinic";
import Header from "../../LayoutSystem/Header/HeaderSystem";
import Footer from "../../LayoutSystem/Footer/FooterSystem";
import styles from "../../LayoutSystem/Layout/Layout.module.css";

const Layout = () => {
    const {user} = useContext(AuthContext);
    return (
        <div className={styles.layoutWrapper}>
            <Header urlImage={user?.avatar || ""} user={user} />
            <Sidebar
                role={user?.roleName || "Phòng khám"}
                name={user?.fullName || "Quản trị viên"}
                urlImage={user?.avatar || ""}
                menusItems={menuItems}
            />
            <div className= {styles.layoutContent}>
                {/* <Header urlImage={user?.avatar || ""} user={user} /> */}
                
                <main className={styles.layoutMain}>
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Layout;