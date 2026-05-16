import React, { useState, useEffect } from "react";
import "./FooterSystem.module.css";

const Footer = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Cập nhật đồng hồ mỗi giây cho sinh động
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <footer className="footer-container">
            <div className="footer-left">
                <span className="version-tag">v1.0.1</span>
                <span className="copyright">
                    © {new Date().getFullYear()} <strong>Doctor Online Connect</strong>. All rights reserved.
                </span>
            </div>

            <div className="footer-right">
                <div className="system-status">
                    <span className="status-dot"></span>
                    Hệ thống trực tuyến
                </div>
                <div className="footer-divider"></div>
                <div className="footer-time">
                    {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
                </div>
            </div>
        </footer>
    );
};

export default Footer;