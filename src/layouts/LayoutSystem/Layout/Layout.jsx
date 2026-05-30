import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import Sidebar from "../Sidebar/SidebarSystem";
import menuItems from "../Sidebar/SidebarMenuSystem";
import Header from "../Header/HeaderSystem";
import Footer from "../Footer/FooterSystem";
import styles from "./Layout.module.css";

const Layout = () => {
    const {user} = useContext(AuthContext);
    return (
        <div className={styles.layoutWrapper}>
            <Header urlImage={user?.avatar || ""} user={user} />
            <Sidebar
                role={user?.roleName || "Admin"}
                name={user?.fullName || "Quản trị viên"}
                menuItems={menuItems}
                urlImage={user?.avatar || ""}
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