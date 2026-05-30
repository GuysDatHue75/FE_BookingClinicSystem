import { useState } from "react";
import "./DocterSlider.css";
import { DocterAll } from "../../../components/DocterComponent/CarDocter";

const DocterSlider = ({ dataDocterDetail }) => {
  const itemsPerPage = 6;

  const pages = [];
  for (let i = 0; i < dataDocterDetail.length; i += itemsPerPage) {
    pages.push(dataDocterDetail.slice(i, i + itemsPerPage));
  }

  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < pages.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  return (
    <div className="doctor-slider">
      {current > 0 && (
        <button className="btn-slide left" onClick={handlePrev}>
          ❮
        </button>
      )}

      <div className="slider-wrapper">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {pages.map((page, i) => (
            <div className="slide" key={i}>
              {page.map((docter, index) => (
                <DocterAll doctor={docter} key={index} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {current < pages.length - 1 && (
        <button className="btn-slide right" onClick={handleNext}>
          ❯
        </button>
      )}
    </div>
  );
};

export default DocterSlider;