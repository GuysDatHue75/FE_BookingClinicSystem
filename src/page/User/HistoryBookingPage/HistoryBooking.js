import { useState, useEffect, useContext } from "react";
import styles from "./HistoryBooking.module.css";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import apiClient from "../../../api/api";
import FeedbackCreate from "../../../components/FeddBackComponent/FeedBackCreate";
import { State } from "../../../state/context";

const HistoryBooking = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const idPatient = localStorage.getItem('idPatient');
  const [dataHistory, setDataHistory] = useState([]);
  const [idDoctor, setIdDoctor] = useState();
  const [idClinic, setIdClinic] = useState();
  const [patient, setPatient] = useState();
  const [idCalenda, setIdCalenda] = useState();

  const [previewImage, setPreviewImage] = useState(null);
  const { feedBack, setFeedBack } = useContext(State);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(`/api/v1/history?id=${idPatient}`);
        const dataPatient = await apiClient.get(`/api/v1/patient/${idPatient}`);
        setPatient(dataPatient.data);
        setDataHistory(response.data);
        console.log(dataPatient.data);


      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };
    getData();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [idPatient]);
  const handelFeedBack = (item) => {
    setIdCalenda(item.maLichKham);
    setIdClinic(item.maPhongKham);
    setIdDoctor(item.maBacSi);
    setFeedBack(true);
  }
  const updateFeedbackStatus = (maLichKham) => {
    setDataHistory((prev) =>
      prev.map((item) =>
        item.maLichKham === maLichKham
          ? { ...item, danhGia: 1 }
          : item
      )
    );
  };
  return (
    <>
      <Header />
      <div className={styles.historyContainer}>
        <h2 className={styles.title}>Lịch sử khám bệnh</h2>
        <div className={styles.tableResponsive}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Phòng khám</th>
                <th>Bác sĩ</th>
                <th>Chuẩn đoán</th>
                <th>Đơn thuốc</th>
                <th>Ngày khám</th>
                <th>Chuyên khoa</th>
                <th>Trạng thái</th>
                <th>Đánh giá dịch vụ</th>
              </tr>
            </thead>
            <tbody>
              {dataHistory.length > 0 ? (
                dataHistory.map((item, index) => (
                  <tr key={item.maSoDonThuoc}>
                    <td>{index + 1}</td>
                    <td >{item.tenPhongKham || "Chưa có"}</td>
                    <td>{item.tenBacSi || "Chưa có"}</td>
                    <td>{item.chuanDoan || "Chưa có chẩn đoán"}</td>
                    <td>
                      {item.maSoDonThuoc ? (
                        <button
                          className={styles.viewBtn}
                          onClick={() => setSelectedPrescription(item)}
                        >
                          <i className="fa-regular fa-eye"></i> Xem
                        </button>
                      ) : (
                        <span>Không có đơn thuốc</span>
                      )}
                    </td>
                    <td>
                      {item.ngayKham
                        ? new Date(item.ngayKham).toLocaleDateString("vi-VN")
                        : ""}
                    </td>
                    <td>{item.tenChuyenKhoa || "Chưa có"}</td>
                    <td>
                      <span className={styles.statusDone}>
                        <i className="fa-solid fa-circle-check"></i> Hoàn tất
                      </span>
                    </td>
                    <td style={{ cursor: "pointer" }}>{item.danhGia == 1 ?
                      <div>
                        <i className="fa-solid fa-circle-check"></i>
                        <span style={{ color: "#008000" }}> Đã P.Hồi</span>
                      </div >
                      : <div className={styles.feedbackHistory} onClick={() => handelFeedBack(item)}>
                        <i class="fa-regular fa-comment"></i>
                        <span> Phản hồi</span>
                      </div>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    Hiện chưa có lịch sử khám bệnh.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedPrescription && (
          <div className={styles.modalOverlay} onClick={() => setSelectedPrescription(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.prescriptionPaper}>
                <div className={styles.prescHeader}>
                  <div className={styles.clinicInfo}>
                    <h4>{selectedPrescription.tenPhongKham.toUpperCase()}</h4>
                    <p>Địa chỉ: {selectedPrescription.diaChiPhongKham}</p>
                    <p>SĐT: {selectedPrescription.sdtPhongKham}</p>
                  </div>
                  <div className={styles.prescTitle}>
                    <h2>ĐƠN THUỐC</h2>
                    <p>Mã đơn: {selectedPrescription.maSoDonThuoc}</p>
                  </div>
                </div>

                <hr />

                <div className={styles.infoSection}>
                  <div className={styles.infoRow}>
                    <span>Họ tên: <b>{patient.taiKhoan.hoVaTen || ""}</b></span>
                    <span>Ngày sinh: {patient.ngaySinh || ""}</span>
                    <span>Giới tính: {patient.gioiTinh ? "Nam" : "Nữ"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Địa chỉ: {patient.diaChi || ""}</span>
                    <span>Cân nặng: {`${patient.canNang}kg` || ""} </span>
                  </div>
                  <p>Triệu chứng: {selectedPrescription.trieuChung}</p>
                  <p>Chẩn đoán: <b>{selectedPrescription.chuanDoan}</b></p>
                </div>

                <table className={styles.medicineTable}>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên thuốc / Hàm lượng</th>
                      <th>SL</th>
                      <th>Đơn giá</th>
                      <th>Đơn vị</th>
                      <th>Cách dùng / Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrescription.danhSachThuoc.map((thuoc, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td><b>{thuoc.tenThuoc}</b></td>
                        <td>{thuoc.soLuong}</td>
                        <td>{thuoc.donGia?.toLocaleString('vi-VN')}</td>
                        <td>{thuoc.donVi}</td>
                        <td>
                          <i>{thuoc.lieuDung}</i> <br />
                          <small>{thuoc.ghiChu}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {selectedPrescription.images && selectedPrescription.images.length > 0 && (
                  <div className={styles.imageSection}>
                    <h5>Hình ảnh lâm sàng:</h5>
                    <div className={styles.imageGrid}>
                      {selectedPrescription.images.map((img, idx) => (
                        <div key={idx} className={styles.imageItem}>
                          <img src={img.tenAnh} alt={img.duongDanAnh} onClick={() => setPreviewImage(img.tenAnh)} />
                          <p>{img.duongDanAnh}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {previewImage && (
                  <div className={styles.imageLightbox} onClick={() => setPreviewImage(null)}>
                    <div className={styles.lightboxContent}>
                      <img src={previewImage} alt="Preview" className={styles.imageZoom} />


                    </div>
                  </div>
                )}
                <div className={styles.prescFooter}>
                  <div className={styles.noteBox}>
                    <p><b>Lời khuyên:</b> {selectedPrescription.ghiChu}</p>
                    <p><b>Kết luận:</b> {selectedPrescription.ketLuan}</p>
                  </div>
                  <div className={styles.signature}>
                    <p>Ngày {new Date(selectedPrescription.ngayLapDon).getDate()} tháng {new Date(selectedPrescription.ngayLapDon).getMonth() + 1} năm {new Date(selectedPrescription.ngayLapDon).getFullYear()}</p>
                    <p><b>Bác sĩ điều trị</b></p>
                    <div className={styles.sigSpace}></div>
                    <p><b>{selectedPrescription.hocHam} {selectedPrescription.tenBacSi}</b></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {feedBack && (<FeedbackCreate
          clinicId={idClinic}
          doctorId={idDoctor}
          calendaId={idCalenda}
          onFeedbackSuccess={updateFeedbackStatus}
        />)}
      </div>
    </>
  );
};

export default HistoryBooking;