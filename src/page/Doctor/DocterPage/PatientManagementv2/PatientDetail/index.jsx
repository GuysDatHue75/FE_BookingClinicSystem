import React, { useEffect, useState } from "react";

import styles from "../PatientDetail/PatientDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../../../api/api";
import editButton from "../../../../../assets/svg/EditButton.svg";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [healthForm, setHealthForm] = useState({});

  useEffect(() => {
    const fetchPatientsDetail = async () => {
      try {
        const response = await apiClient.get(`/api/v1/patient/get-detail/${id}`);
        setPatient(response.data);
        console.log(response);
        
      } catch (error) {
        console.error("Lỗi lấy dữ liệu api: ", error);

      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPatientsDetail();
  }, [id]);

  const handleEditClick = () => {
    setHealthForm({
      maBenhNhan: patient.maBenhNhan,
      chieuCao: patient.chieuCao || "",
      canNang: patient.canNang || "",
      nhomMau: patient.nhomMau || "",
      tienSuBenhAn: patient.tienSuBenhAn || "",
      tinhTrangSucKhoe: patient.tinhTrangSucKhoe || ""
    });
    setIsEditingHealth(true);
  };

  const handleSaveHealth = async () => {
    try {
      const response = await apiClient.put('/api/v1/patient/update', healthForm);
      setPatient(response.data);
      setIsEditingHealth(false);
    } catch (error) {
      alert("Lỗi khi cập nhật!");
    }
  };

  // Hàm tính Tuổi tự động từ ngày sinh
  const calculateAge = (dob) => {
    if (!dob) return "Chưa cập nhật";
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  // Hàm format Date hiển thị chuẩn VN
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  // HÀM TÍNH BMI TỰ ĐỘNG (Kg / m^2)
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return "---";
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    if (isNaN(weightNum) || isNaN(heightNum) || heightNum === 0) return "---";

    const heightInMeters = heightNum / 100;
    const bmi = (weightNum / Math.pow(heightInMeters, 2)).toFixed(1);
    return bmi;
  };

  // Xác định BMI dựa trên state (khi đang edit dùng data form, khi xem dùng data patient)
  const currentBMI = isEditingHealth
    ? calculateBMI(healthForm.canNang, healthForm.chieuCao)
    : calculateBMI(patient?.canNang, patient?.chieuCao);
  if (loading) return <div className={styles.loading}>Đang tải thông tin bệnh nhân...</div>;
  if (!patient) return <div className={styles.error}>Không tìm thấy thông tin bệnh nhân.</div>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.mainContent}>
        <button className={styles.backButton} onClick={() => navigate(`/doctor/patients`)}>
          ← Trở lại Danh sách bệnh nhân
        </button>

        <h1 className={styles.pageTitle}>Thông tin và lịch sử khám bệnh</h1>

        <div className={styles.gridLayout}>
          {/* CỘT TRÁI */}
          <div className={styles.leftColumn}>

            {/* 1. Header Card */}
            <div className={styles.patientHeaderCard}>
              <div className={styles.avtGroup}>
                <div className={styles.avatar}>
                  {patient.anhDaiDien ? (
                    <img src={patient.anhDaiDien} alt="Avatar" className={styles.avatarImg} />
                  ) : (
                    patient.hoVaTen?.charAt(0) || "P"
                  )}
                </div>
                <div className={styles.name}>
                  <h2 className={styles.patientName}>{patient.hoVaTen}</h2>
                  <p className={styles.patientId}>ID: {patient.maBenhNhan}</p>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <img
                  src={editButton}
                  alt="Sửa"
                  className={styles.iconBtn}
                  onClick={handleEditClick}
                  title="Chỉnh sửa thông tin sức khỏe"
                />
              </div>
            </div>

            {/* 2. Card Detail (Thông tin cá nhân + Sức khỏe) */}
            <div className={styles.infoCard}>
              {/* --- PHẦN 1: THÔNG TIN CÁ NHÂN (Chỉ xem) --- */}
              <div className={styles.sectionHeader}>
                <h3>Thông tin cá nhân</h3>
                <span className={styles.dotsMenu}>...</span>
              </div>
              <div className={styles.infoGrid}>
                <p><span>Họ và tên:</span> <strong>{patient.hoVaTen}</strong></p>
                <p><span>Tuổi:</span> <strong>{calculateAge(patient.ngaySinh)}</strong></p>
                <p><span>Giới tính:</span> <strong>{patient.gioiTinh ? "Nam" : "Nữ"}</strong></p>
                <p><span>Ngày sinh:</span> <strong>{formatDate(patient.ngaySinh)}</strong></p>
                <p><span>Nghề nghiệp:</span> <strong>{patient.ngheNghiep || "Chưa cập nhật"}</strong></p>
              </div>

              {/* --- PHẦN 2: THÔNG TIN SỨC KHỎE (Sửa trực tiếp) --- */}
              <div className={styles.sectionHeader} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #eee' }}>
                <h3 className={styles.subTitle} style={{ margin: 0, border: 'none', padding: 0 }}>Thông tin sức khỏe</h3>

                {/* Nút Edit / Lưu / Hủy */}
                {isEditingHealth ? (
                  <div className={styles.editActions} style={{ display: 'flex', gap: '8px' }}>
                    <button className={styles.cancelBtn} onClick={() => setIsEditingHealth(false)}>Hủy</button>
                    <button className={styles.saveBtn} onClick={handleSaveHealth}>Lưu</button>
                  </div>
                ) : (
                  <img src={editButton} alt="Sửa" className={styles.iconBtn} onClick={handleEditClick} style={{ width: '32px', height: '32px', padding: '4px', cursor: 'pointer' }} title="Cập nhật sức khỏe" />
                )}
              </div>

              <div className={styles.infoGrid}>
                {/* Hàng Chiều cao */}
                <p><span>Chiều cao:</span>
                  {isEditingHealth ? (
                    <input type="number" value={healthForm.chieuCao} onChange={(e) => setHealthForm({ ...healthForm, chieuCao: e.target.value })} className={styles.inlineInput} placeholder="VD: 160" />
                  ) : (
                    <strong>{patient.chieuCao ? `${patient.chieuCao} cm` : 'Chưa có'}</strong>
                  )}
                </p>

                {/* Hàng Nhóm máu */}
                <p><span>Nhóm máu:</span>
                  {isEditingHealth ? (
                    <select value={healthForm.nhomMau} onChange={(e) => setHealthForm({ ...healthForm, nhomMau: e.target.value })} className={styles.inlineInput}>
                      <option value="">Chọn</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  ) : (
                    <strong>{patient.nhomMau || 'Chưa có'}</strong>
                  )}
                </p>

                {/* Hàng Cân nặng */}
                <p><span>Cân nặng:</span>
                  {isEditingHealth ? (
                    <input type="number" value={healthForm.canNang} onChange={(e) => setHealthForm({ ...healthForm, canNang: e.target.value })} className={styles.inlineInput} placeholder="VD: 60" />
                  ) : (
                    <strong>{patient.canNang ? `${patient.canNang} kg` : 'Chưa có'}</strong>
                  )}
                </p>
                {/* BMI TỰ ĐỘNG */}
                <p><label>BMI:</label>
                  <strong>{currentBMI}</strong>
                </p>
                {/* Hàng Tình trạng sức khỏe */}
                <p><span>Tình trạng SK:</span>
                  {isEditingHealth ? (
                    <input type="text" value={healthForm.tinhTrangSucKhoe} onChange={(e) => setHealthForm({ ...healthForm, tinhTrangSucKhoe: e.target.value })} className={styles.inlineInput} placeholder="VD: Ổn" />
                  ) : (
                    <strong>{patient.tinhTrangSucKhoe || 'Chưa cập nhật'}</strong>
                  )}
                </p>

                {/* Hàng Tiền sử bệnh án (Chiếm full 2 cột nếu cần) */}
                <p style={{ gridColumn: "span 2" }}><span>Tiền sử bệnh án:</span>
                  {isEditingHealth ? (
                    <textarea
                      value={healthForm.tienSuBenhAn}
                      onChange={(e) => setHealthForm({ ...healthForm, tienSuBenhAn: e.target.value })}
                      className={styles.inlineInput}
                      style={{ width: "100%", marginTop: "8px", minHeight: "60px" }}
                      placeholder="Ghi nhận các bệnh đã mắc..."
                    />
                  ) : (
                    <strong style={{ display: "block", marginTop: "4px" }}>{patient.tienSuBenhAn || 'Không có'}</strong>
                  )}
                </p>
              </div>
            </div>

            {/* 3. Lịch sử khám bệnh (Table) */}
            <div className={styles.historyCard}>
              <h3>Lịch sử khám bệnh</h3>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Ngày Khám</th>
                    <th>Bác sĩ</th>
                    <th>Chẩn đoán</th>
                    <th>Thuốc được kê</th>
                    <th>Kết luận / Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.lichSuKham && patient.lichSuKham.length > 0 ? (
                    patient.lichSuKham.map((kham, index) => (
                      <tr key={index}>
                        <td>{formatDate(kham.ngayLap)}</td>
                        <td>{kham.tenBacSi}</td>
                        <td>
                          <strong>{kham.chuanDoan || "Không rõ"}</strong> <br />
                          <span style={{ fontSize: "12px", color: "#666" }}>{kham.trieuChung}</span>
                        </td>
                        <td>
                          {kham.danhSachThuoc && kham.danhSachThuoc.length > 0 ? (
                            <ul style={{ paddingLeft: "15px", margin: 0, fontSize: "13px" }}>
                              {kham.danhSachThuoc.map((thuoc, idx) => (
                                <li key={idx}>
                                  <strong>{thuoc.tenThuoc}</strong> ({thuoc.soLuong} {thuoc.donVi})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span style={{ color: "#999" }}>Không kê thuốc</span>
                          )}
                        </td>
                        <td style={{ fontSize: "13px" }}>
                          {kham.ketLuan}
                          {kham.ghiChu && <div><em>*Lưu ý: {kham.ghiChu}</em></div>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                        Bệnh nhân chưa có lịch sử khám.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* CỘT PHẢI */}
          <div className={styles.rightColumn}>
            {/* Thông tin liên hệ */}
            <div className={styles.contactCard}>
              <div className={styles.sectionHeader}>
                <h3>Thông tin liên hệ</h3>
                <span className={styles.dotsMenu}>...</span>
              </div>
              <div className={styles.contactItem}>
                <span>Số điện thoại:</span>
                <p>{patient.soDienThoai || "Chưa cập nhật"}</p>
              </div>
              <div className={styles.contactItem}>
                <span>Email:</span>
                <p>{patient.email || "Chưa cập nhật"}</p>
              </div>
              <div className={styles.contactItem}>
                <span>Địa chỉ:</span>
                <p>{patient.diaChi || "Chưa cập nhật"}</p>
              </div>
            </div>

            {/* Báo cáo sức khỏe (PDF Files) - Giữ nguyên tĩnh để ráp API sau */}
            <div className={styles.reportCard}>
              <h3>Báo cáo sức khỏe</h3>
              <div className={styles.fileItem}>
                <div className={styles.fileIcon}>PDF</div>
                <div className={styles.fileInfo}>
                  <p>sieu_am_vom_hong_11_12.pdf</p>
                  <span>1.45 MB • 12/12/2025</span>
                </div>
                <a href="#" className={styles.downloadBtn} title="Tải về máy">↓</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>


  )



}


export default PatientDetail;
