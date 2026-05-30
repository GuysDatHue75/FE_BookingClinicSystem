import { useEffect, useRef } from "react";
import "./FeedBack.css";
import userAVT from "../../assets/image/user-avt.png";

const FeedBack = ({ dataFeedBack }) => {
  const wrapperRef = useRef(null);

  const scroll = (direction) => {
    if (wrapperRef.current) {
      const { current } = wrapperRef;
      const itemWidth = current.querySelector(".item-feedBack").offsetWidth + 30; 
      
      current.scrollBy({
        left: direction === "left" ? -itemWidth : itemWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container-feedback">
      <h2 className="title-detail">Bệnh nhân nói gì?</h2>
      
      {dataFeedBack.length > 3 && (
        <div className="scroll-buttons">
          <button className="nav-btn prev" onClick={() => scroll("left")}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button className="nav-btn next" onClick={() => scroll("right")}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}

      <div className="wrapper-feedBack" ref={wrapperRef}>
        {dataFeedBack.length > 0 ? (
          dataFeedBack.map((item) => (
            <div className="item-feedBack" key={item.maDanhGia}>
              <p className="content-feedBack">"{item.noiDung}"</p>
              <div className="infor-user-feedback">
                <img
                  src={item.benhNhan?.taiKhoan?.anhDaiDien || userAVT}
                  alt=""
                  className="image-user-feedback"
                />
                <div className="user-feedBack">
                  <p className="name-clinic-feedback">
                    {item.benhNhan?.taiKhoan?.hoVaTen}
                  </p>
                  <div className="stars-feedback">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className="fa-solid fa-star"
                        style={{ color: i < (item.soSaoPhongKham || 0) ? "gold" : "#ddd" }}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-feedback">Chưa có cảm nhận nào từ bệnh nhân.</p>
        )}
      </div>
    </div>
  );
};

export default FeedBack;