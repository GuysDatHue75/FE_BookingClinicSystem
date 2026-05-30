import React from "react";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api/api";
import { useState, useEffect } from "react";
import styles from "./NewsCpn.module.css"
import Header from "../../layouts/LayoutsUser/Header/Header";
import TotalPage from "../TotalPagaComponent/TotalPage";
const NewsCpn = () => {
    const totalPageInPage = 10;
    const { page: pageParam } = useParams();
    const { id } = useParams();
    const [totalPage, setTotalPage] = useState();
    const navigate = useNavigate();
    const city = localStorage.getItem("city");
    const [dataNewsList, setDataNewsList] = useState([]);
    const currentPage = useMemo(() => parseInt(pageParam) || 1, [pageParam]);

    const getNews = async () => {
        let dataNews;
        if (id) {
            dataNews = await apiClient.get(`/api/v1/clinic/news?id=${id}&page=${currentPage - 1}&size=${totalPageInPage}`);
        } else {
            dataNews = await apiClient.get(`/api/v1/news?tp=${city}&page=${currentPage - 1}&size=${totalPageInPage}`);
        }
        const total = dataNews.data.totalPages;

        if (total > 0 && currentPage > total) {
            navigate(`/tin-tuc/page/${total}`);
            return;
        }
        setDataNewsList(dataNews.data.content);
        setTotalPage(total)
    }


    useEffect(() => {
        getNews();
        window.scrollTo({ top: "true", behavior: "smooth" });
    }, [currentPage, city])

    const handlePage = (p) => {
        navigate(`/tin-tuc/page/${p}`)
    }
    return (
        <>
            <Header />
            <div className={styles.containerNews}>
                <h2 className={styles.titleNews}>Tin tức</h2>
                <div className={styles.wrapperNews}> <div className={styles.newsRight}>
                    {dataNewsList.length > 0 ? dataNewsList?.map((news, index) => (
                        <Link to={`/tin-tuc/xem-chi-tiet/${news.maTinTuc}`} className={styles.itemNewsRight} key={index}>
                            <img src={news.anh} className={styles.imageNewsRight} />
                            <div className={styles.contentNewsRight}>
                                <p className={styles.authorNewsRight}>{news.author}</p>
                                <p className={styles.titleNewsRight}>{news.tieuDe}</p>
                                <p className={styles.dateNewsRight}> <i class="faRegular fa-calendar">
                                </i> {news.ngayTao.split('T')[0]} </p> <p>{news.phongKham.tenPhongKham}</p> </div>
                        </Link>)) : <p>Chưa có tin tức được đăng tải...</p>}
                </div>
                </div>
            </div >
            <TotalPage totalPages={totalPage} currentPage={currentPage} handlePage={handlePage} />
        </>
    );
}


export default NewsCpn;