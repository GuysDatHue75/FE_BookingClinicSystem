import React from "react";
import styles from "./TotalPage.module.css"; 

const TotalPage = ({ totalPages, currentPage, handlePage }) => {
  const curr = Number(currentPage);

  const getPaginationRange = () => {
    const delta = 2; 
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= curr - delta && i <= curr + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <button 
        className={styles.navBtn}
        disabled={curr === 1} 
        onClick={() => handlePage(curr - 1)}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      {getPaginationRange().map((p, index) => {
        const isDots = p === "...";
        
        return (
          <span
            key={index}
            className={`
              ${styles.pageItem} 
              ${curr === p ? styles.active : ""} 
              ${isDots ? styles.dots : ""}
            `}
            onClick={() => !isDots && handlePage(p)}
          >
            {p}
          </span>
        );
      })}

      <button 
        className={styles.navBtn}
        disabled={curr === totalPages} 
        onClick={() => handlePage(curr + 1)}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default TotalPage;