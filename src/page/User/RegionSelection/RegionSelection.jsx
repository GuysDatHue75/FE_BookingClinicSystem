import React, { useState, useEffect } from "react";
import styles from "./RegionSelection.module.css";
import axios from "axios";
import bcg from "../../../assets/image/backgroundBody.webp"
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/api";
const RegionSelection = () => {
    const [provinces, setProvinces] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    
    const navigate = useNavigate();
    const idpatient = localStorage.getItem('idPatient');
    const idAccount = localStorage.getItem('idAccount')
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
                if (response.data.error === 0) {
                    setProvinces(response.data.data);
                }

            } catch (error) {
                console.error("Lỗi lấy dữ liệu tỉnh thành:", error);
            }
        };
        fetchProvinces();
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const handleConfirm = async () => {
        const selectedRegion = provinces.find(p => p.id === selectedId);
        if (selectedRegion) {
            localStorage.setItem("city", selectedRegion.name);
            localStorage.setItem('isOneLogin', user.taiKhoan.lanDauDangNhap);
            await apiClient.put(`/api/v1/patientQQ/${idpatient}`, {
                qq: selectedRegion.name
            })
            navigate("/trang-chu")
        }
    };
    return (
        <>
            <img src={bcg} alt="bcb" className={styles.imatt} />
            <div className={styles.overlay}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h2>Chào mừng bạn!</h2>
                        <p>Vui lòng chọn khu vực của bạn để chúng tôi tối ưu trải nghiệm</p>
                    </div>


                    <div className={styles.grid}>
                        {provinces.length > 0 ? (
                            provinces.map((item) => (
                                <div key={item.id} className={`${styles.regionItem} ${selectedId === item.id ? styles.selected : ""}`} onClick={() => handleSelect(item.id)}>
                                    {item.full_name}
                                </div>
                            ))
                        ) : (
                            <p>Đang tải danh sách tỉnh thành...</p>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            className={styles.confirmBtn}
                            disabled={!selectedId}
                            onClick={handleConfirm}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegionSelection;