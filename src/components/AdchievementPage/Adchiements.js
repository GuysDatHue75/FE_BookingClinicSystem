import { Link, useParams } from "react-router-dom";
import Button, { ViewMore } from "../ButtonComponent/Button";
import "./Adchiements.css";
import { useEffect } from "react";
const Adchiements = ({ dataAdchievement }) => {
  const{id:idClinic} = useParams();
  return (
    <div className="container-adchiement">
      {dataAdchievement?.length > 0 ? (
        dataAdchievement?.slice(0,3).map((adchiement) => (
          <div key={adchiement.maTinTuc} className="wrapprer-adchiement">
            <img
              src={adchiement.anh}
              alt={adchiement.tieuDe}
              className="image-adchiement"
            />
            <div style={{margin:"0px"}}>
              <h3 className="title-adchiement">{adchiement.tieuDe}</h3>
              <p className="des-adchiement">{adchiement.noiDung}</p>
              {/* <Button booking={true} /> */}
              <Link className="btn-detailNews" to={`/tin-tuc/xem-chi-tiet/${adchiement.maTinTuc}`}>Xem chi tiết</Link>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>
          Chưa có thành tựu nào được đăng tải.
        </p>
      )}
      {dataAdchievement?.length > 0 ? <div style={{textAlign:"center"}}><ViewMore path={`/tin-tuc/${idClinic}`} /> </div>: ""}

    </div>
  );
};

export default Adchiements;
