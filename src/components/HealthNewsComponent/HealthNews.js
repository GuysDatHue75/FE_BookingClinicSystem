import React, { useEffect, useState } from "react";
import HealthNew from "../../data/HealthNews.json";
import "./HealthNews.css";
import apiClient from "../../api/api";
import { Link } from "react-router-dom";
const HealthNews = ({dataNews}) => {
  return (
    <div className="container-news">
      <h2 className="title-news">Tin tức mới nhất</h2>
      <div className="wrapper-news">
        <div className="news-right">
          {dataNews?.length >= 0 ? dataNews?.slice(0, 7).map((news, index) => (
            <Link to={`/tin-tuc/xem-chi-tiet/${news.maTinTuc}`}  className="item-news-right" key={index}>
              <img src={news.anh} className="image-news-right" />
              <div className="content-news-right">
                <p className="author-news-right">{news.author}</p>
                <p className="title-news-right">{news.tieuDe}</p>
                <p className="date-news-right">
                  <i class="fa-regular fa-calendar"></i> {news.ngayTao.split('T')[0]}
                </p>
                <p>{news.phongKham.tenPhongKham}</p>
              </div>
            </Link>
          )) : <p style={{fontSize:"18px",fontWeight:"500", margin:"0"}}>Chưa có tin tức được đăng tải.</p>}
        </div>
      </div>
    </div>
  );
};

export default HealthNews;
