import React, { useEffect, useState } from "react";
import styles from "./NewsDetail.module.css";
import { useParams } from "react-router-dom";
import apiClient from "../../../api/api";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import { Link } from "react-router-dom";
const NewsDetail = () => {
    const { id: idNews } = useParams();
    const [dataNews, setDataNews] = useState();
    useEffect(() => {
        const getNewsDetail = async () => {
            const dataNews = await apiClient.get(`/api/v1/news/${idNews}`);

            setDataNews(dataNews.data);
        }
        getNewsDetail();
    }, [])

    return (
        <>
            <Header />
            {dataNews ? <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <h1 className={styles.title}>{dataNews?.tieuDe}</h1>
                    <div className={styles.meta}>
                        <Link style={{margin:"0", display:"flex", alignItems:"center",textDecoration:"none"}} to={`/chi-tiet-phong-kham/${dataNews?.phongKham.maPhongKham}`}>
                            <img  className={styles.imgaeClinic} src={dataNews?.phongKham.anhPhongKham} alt={dataNews?.phongKham.tenPhongKham}/>
                            <span className={styles.author}>{dataNews?.phongKham.tenPhongKham}</span>
                        </Link>
                        <span className={styles.dot}>•</span>
                        <span className={styles.date}>{dataNews?.ngayTao.split(['T'])[0] + " - " + dataNews?.ngayTao.split(['T'])[1].split(".")[[0]]}</span>
                    </div>
                    <div className={styles.thumbnailWrapper}>
                        <img
                            src={dataNews?.anh}
                            alt="thumbnail"
                            className={styles.thumbnail}
                        />
                    </div>
                        <p className={styles.subContent}>{dataNews?.moTaNgan}</p>
                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: dataNews?.noiDung }}
                    />
                </div>
            </div> : 
            <p style={{margin:"100px"}}>Tin này đã bị xóa.</p>
    }   
        </>
    );
};

export default NewsDetail;