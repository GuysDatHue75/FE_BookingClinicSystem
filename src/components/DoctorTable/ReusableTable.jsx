import React from "react";
import styles from "./ReusableTable.module.css";
const ReusableTable = ({ columns, data, loading, filterComponent, pagination }) => {
    return (
        <div className={styles.tableWapper}>
            <div className={styles.filterSection}>
                {filterComponent}
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.mainTable}>
                    <thead>
                        <tr>
                            {columns.map((col,idx) => (
                                <th key={idx}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ? (
                                <tr>
                                    <td colSpan={columns.length} className={styles.loadingText}>
                                        Đang tải dữ liệu ...
                                    </td>
                                </tr>
                            ) : Date.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex}>
                                                {col.render ? col.render(row) : row[col.render]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className={styles.noData}>
                                        Không có dữ liệu ...
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            <div className={styles.paginationSection}>
                {pagination}
            </div>
        </div>
    )
}
export default ReusableTable;