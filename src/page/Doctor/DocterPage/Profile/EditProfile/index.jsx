import React, { useContext, useState, useEffect } from "react";
// Import CSS Module của riêng EditProfile
import styles from "../Profile.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { State } from "../../../../../state/context";
import apiClient from "../../../../../api/api";

const EditProfile = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const { image, setImage } = useContext(State);

  const maBacSi = localStorage.getItem("maBacSi") || "BS001";

  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0 });
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/v1/doctor/profile/${maBacSi}`);
      setDoctorInfo(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin hồ sơ bác sĩ:", error);
      toast.error("Không thể tải thông tin hồ sơ!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "gioiTinh") {
      setDoctorInfo({ ...doctorInfo, [name]: value === "true" });
    } else {
      setDoctorInfo({ ...doctorInfo, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(`/api/v1/doctor/profile/${maBacSi}`, doctorInfo);
      toast.success("Cập nhật thông tin thành công!", { position: "top-center" });
      setEditingField(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    fetchDoctorProfile();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setDoctorInfo({ ...doctorInfo, anhDaiDien: url });
    }
  };

  if (loading || !doctorInfo) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Đang tải dữ liệu...</div>;
  }

  const avatarUrl = doctorInfo.anhDaiDien
    ? doctorInfo.anhDaiDien.startsWith("http") || doctorInfo.anhDaiDien.startsWith("blob")
      ? doctorInfo.anhDaiDien
      : `http://localhost:8080/uploads/${doctorInfo.anhDaiDien}`
    : image;

  return (
    <>
      <div className={styles.profileContainer}>
        {/* ================= CỘT TRÁI ================= */}
        <div className={styles.profileLeftColumn}>
          <div className={styles.avatarSection} style={{ position: "relative" }}>
            <img src={avatarUrl} alt="Avatar Bác sĩ" className={styles.doctorAvatar} />
            <label
              htmlFor="avatar-upload"
              style={{
                position: "absolute", bottom: 15, right: 15, cursor: "pointer",
                background: "#fff", padding: "5px", borderRadius: "50%",
              }}
            >
              <i className="fas fa-edit"></i>
            </label>
            <input
              id="avatar-upload" type="file" accept="image/*" style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>

          <div className={`${styles.infoSection} ${styles.contactInfo}`}>
            <h4>Thông Tin Liên Hệ</h4>
            <ul>
              <li>
                <span>Giới tính: </span>
                {editingField === "gioiTinh" ? (
                  <select name="gioiTinh" value={doctorInfo.gioiTinh} onChange={handleChange} autoFocus>
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                ) : (
                  <>
                    <strong>{doctorInfo.gioiTinh ? "Nam" : "Nữ"}</strong>
                    <i className="fas fa-edit" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => setEditingField("gioiTinh")}></i>
                  </>
                )}
              </li>

              {[
                { key: "ngaySinh", label: "Ngày sinh", type: "date" },
                { key: "cccd", label: "CCCD", type: "text" },
                { key: "diaChi", label: "Địa chỉ", type: "text" },
                { key: "soDienThoai", label: "Số ĐT", type: "text" },
                { key: "email", label: "Email", type: "text" },
              ].map((field, idx) => (
                <li key={idx}>
                  <span>{field.label}: </span>
                  {editingField === field.key ? (
                    <input
                      type={field.type} name={field.key} value={doctorInfo[field.key] || ""}
                      onChange={handleChange} autoFocus style={{ width: "60%" }}
                    />
                  ) : (
                    <>
                      <strong>{doctorInfo[field.key] || "Chưa cập nhật"}</strong>
                      <i className="fas fa-edit" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => setEditingField(field.key)}></i>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.infoSection} ${styles.careerObjective}`}>
            <h4>Mục Tiêu Nghề Nghiệp</h4>
            {editingField === "mieuTa1" ? (
              <textarea
                name="mieuTa1" rows="4" style={{ width: "100%", padding: "5px" }}
                value={doctorInfo.mieuTa1 || ""} onChange={handleChange} autoFocus
              />
            ) : (
              <p style={{ position: "relative", whiteSpace: "pre-line" }}>
                {doctorInfo.mieuTa1 || "Chưa có thông tin"}
                <i className="fas fa-edit" style={{ cursor: "pointer", marginLeft: "10px", position: "absolute", right: 0 }} onClick={() => setEditingField("mieuTa1")}></i>
              </p>
            )}
          </div>
        </div>

        {/* ================= CỘT PHẢI ================= */}
        <div className={styles.profileRightColumn}>
          <div className={styles.rightBox}>

            <div className={styles.rightHeader}>
              {editingField === "hoVaTen" ? (
                <input type="text" name="hoVaTen" value={doctorInfo.hoVaTen || ""} onChange={handleChange} style={{ fontSize: "1.5rem", fontWeight: "bold", width: "100%" }} autoFocus />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h2>{doctorInfo.hoVaTen ? doctorInfo.hoVaTen.toUpperCase() : "CHƯA CÓ TÊN"}</h2>
                  <i className="fas fa-edit" style={{ cursor: "pointer" }} onClick={() => setEditingField("hoVaTen")}></i>
                </div>
              )}
            </div>

            <div className={`${styles.rightSection} ${styles.education}`}>
              <h3><i className="fas fa-graduation-cap"></i> HỌC VẤN & THÔNG TIN CHUYÊN MÔN</h3>
              <ul>
                {[
                  { key: "chucVu", label: "Chức vụ" },
                  { key: "hocHam", label: "Học hàm/vị" },
                  { key: "bangCap", label: "Bằng cấp" },
                  { key: "kinhNghiem", label: "Kinh nghiệm" },
                  { key: "soGiayPhep", label: "Số giấy phép" },
                ].map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "10px" }}>
                    <span style={{ display: "inline-block", width: "120px", fontWeight: "bold" }}>{item.label}:</span>
                    {editingField === item.key ? (
                      <input type="text" name={item.key} value={doctorInfo[item.key] || ""} onChange={handleChange} autoFocus style={{ width: "60%" }} />
                    ) : (
                      <>
                        <span>{doctorInfo[item.key] || "Chưa cập nhật"}</span>
                        <i className="fas fa-edit" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => setEditingField(item.key)}></i>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.rightSection} ${styles.activities}`}>
              <h3><i className="fas fa-flag"></i> HOẠT ĐỘNG & QUÁ TRÌNH CÔNG TÁC</h3>
              <div className={styles.timelineContainer}>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineDate}>Lịch sử hoạt động</span>
                  <div className={styles.timelineContent}>
                    {editingField === "hoatDong" ? (
                      <textarea name="hoatDong" rows="4" style={{ width: "100%" }} value={doctorInfo.hoatDong || ""} onChange={handleChange} autoFocus />
                    ) : (
                      <p style={{ whiteSpace: "pre-line" }}>
                        {doctorInfo.hoatDong || "Chưa có thông tin"}
                        <i className="fas fa-edit" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => setEditingField("hoatDong")}></i>
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.timelineItem}>
                  <span className={styles.timelineDate}>Thông tin bổ sung</span>
                  <div className={styles.timelineContent}>
                    {editingField === "mieuTa2" ? (
                      <textarea name="mieuTa2" rows="3" style={{ width: "100%" }} value={doctorInfo.mieuTa2 || ""} onChange={handleChange} autoFocus />
                    ) : (
                      <p style={{ whiteSpace: "pre-line" }}>
                        {doctorInfo.mieuTa2 || "Chưa có thông tin bổ sung"}
                        <i className="fas fa-edit" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => setEditingField("mieuTa2")}></i>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= NÚT XÁC NHẬN ================= */}
      {editingField !== null && (
        <div style={{ width: "100%", textAlign: "center", margin: "20px 0", color: "red", fontWeight: "bold" }}>
          * Đang ở chế độ chỉnh sửa. Vui lòng bấm Cập Nhật để lưu!
        </div>
      )}
      <div style={{ width: "90%", maxWidth: "900px", margin: "20px auto", display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={handleUpdate}
          style={{ backgroundColor: "#1B7EEE", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
        >
          Cập nhật
        </button>
        <button onClick={handleCancel} style={{ padding: "10px 20px", cursor: "pointer", borderRadius: "5px", border: "1px solid #ccc" }}>
          Hủy bỏ
        </button>
      </div>
    </>
  );
};

export default EditProfile;