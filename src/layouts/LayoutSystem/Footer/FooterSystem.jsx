import React, { useState, useEffect } from "react";
import styles from "./FooterSystem.module.css";

const Footer = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Cập nhật đồng hồ mỗi giây cho sinh động
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <footer className={styles['footer-container']}>
            <div className={styles['footer-left']}>
                <span className={styles['version-tag']}>v1.0.1</span>
                
                {/* Từ viết liền không có gạch ngang có thể dùng dấu chấm */}
                <span className={styles.copyright}>
                    © {new Date().getFullYear()} <strong>Doctor Online Connect</strong>. All rights reserved.
                </span>
            </div>

            <div className={styles['footer-right']}>
                <div className={styles['system-status']}>
                    <span className={styles['status-dot']}></span>
                    Hệ thống trực tuyến
                </div>
                
                <div className={styles['footer-divider']}></div>
                
                <div className={styles['footer-time']}>
                    {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
                </div>
            </div>
        </footer>
    );
};

export default Footer;