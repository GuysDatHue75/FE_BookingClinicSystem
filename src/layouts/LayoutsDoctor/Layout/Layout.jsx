import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer"; 
import menuItems from "../Sidebar/sidebarMenu";
import { State } from "../../../state/context";

const Layout = () => {
  const { image } = useContext(State);
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#ffffff", 
      }}
      >
      {/* 1. SIDEBAR CỐ ĐỊNH BÊN TRÁI */}
      <Sidebar
        role={"Bác sĩ"}
        name={"Nguyễn Hữu Cảnh"}
        menuItems={menuItems}
        urlimage={image}
        />

      {/* 2. KHU VỰC BÊN PHẢI (CHỨA HEADER, CONTENT, FOOTER) */}
      <div
        style={{
          marginLeft: "230px", 
          flexGrow: 1,
          width: "calc(100% - 230px)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        >
        
        <Header urlImage={image} />

        {/* NỘI DUNG CHÍNH (PHẦN CUỘN) */}
        <main
          style={{
            flexGrow: 1,
            padding: "24px",
            marginTop: "80px",   
            marginBottom: "40px", 
            minHeight: "calc(100vh - 120px)", 
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>

        {/* FOOTER CỐ ĐỊNH (Cao 40px) */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;