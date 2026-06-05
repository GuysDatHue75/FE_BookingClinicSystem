import { useContext, useState, useEffect, useRef } from "react";
import styles from "./Profile.module.css";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import Footer from "../../../components/FooterComponent/Footer";
import { State } from "../../../state/context";
import apiClient from "../../../api/api";
import userImage from "../../../assets/image/user-avt.png"
import { toast } from "react-toastify";
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { avatar, setAvatar } = useContext(State);
  const [warning, setWarning] = useState(true);
  const idPatient = localStorage.getItem("idPatient");
  const [profile, setProfile] = useState(null);
  const typeSubmit = useRef();
  const infors = [
    { label: "Họ và tên", name: "taiKhoan.hoVaTen" },
    { label: "Email", name: "email" },
    { label: "Số điện thoại", name: "soDienThoai" },
    { label: "Giới tính", name: "gioiTinh" },
    { label: "Ngày sinh", name: "ngaySinh" },
    { label: "Địa chỉ", name: "diaChi" },
    { label: "Nghề nghiệp", name: "ngheNghiep" },
    { label: "Chiều cao", name: "chieuCao" },
    { label: "Cân nặng", name: "canNang" },
    { label: "Nhóm máu", name: "nhomMau" },
    { label: "Quê quán", name: "queQuan" },
    { label: "Tình trạng sức khỏe", name: "tinhTrangSucKhoe" },
    { label: "Tiền sử bệnh án", name: "tienSuBenhAn" }
  ];
  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name.startsWith("taiKhoan.")) {
      const key = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        taiKhoan: {
          ...prev.taiKhoan,
          [key]: value,
        },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }

  };

  const toggleEdit = async () => {
    if (isEditing) {
      try {
        const response = await apiClient.put(`api/v1/patient/${idPatient}`, profile);
        
        setIsEditing(false);
        window.location.reload();

      } catch (error) {
        alert("Số điện thoại đã tồn tại trong hệ thống. Vui lòng nhập số khác!");
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setAvatar(base64String);
        const response = await apiClient.put(`/api/v1/update-image`, {
          maTaiKhoan: profile.taiKhoan.maTaiKhoan,
          anhBase64: base64String
        });
        if (response.status === 200) {
          setProfile(prev => ({
            ...prev,
            taiKhoan: { ...prev.taiKhoan, anhDaiDien: base64String }
          }));
        }

      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchProfileUser = async () => {
      const response = await apiClient.get(`/api/v1/patient/${idPatient}`);

      setProfile(response.data);

      setAvatar(
        `${response.data.taiKhoan?.anhDaiDien}` || userImage
      );
    };

    fetchProfileUser();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        {warning && (
          <div className={styles.profile}>
            <p>
              Nếu có thể hãy điền đầy đủ thông tin để bác sĩ hiểu rõ tình trạng
              của bạn!
            </p>
            <i
              className={`fa-solid fa-xmark ${styles.close}`}
              onClick={() => setWarning(false)}
            ></i>
          </div>
        )}

        <div className={styles.profileCard}>
          <h2>Hồ sơ cá nhân</h2>

          <div className={styles.wrapperProfile}>
            <div className={styles.editImage}>
              <img src={avatar || userImage} className={styles.imageProfile} alt="Avatar" />
              <p
                className={styles.btnEdit}
                onClick={() =>
                  document.getElementById("avatarInput").click()
                }
              >
                <i className="fa-solid fa-pen"></i> Chỉnh sửa
              </p>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </div>
            <div className={styles.inforUserProfile}>
              {infors.map((item, index) => {
                const value = item.name.startsWith("taiKhoan.")
                  ? profile.taiKhoan?.[item.name.split(".")[1]]
                  : profile[item.name];
                if (item.name === "gioiTinh") {
                  return (
                    <div key={index} className={styles.profileField}>
                      <label>{item.label}</label>

                      {isEditing ? (
                        <select
                          name="gioiTinh"
                          value={value}
                          onChange={handleChange}
                          className={styles.editSex}
                        >
                          <option value={""}>Chọn giới tính</option>
                          <option value={true}>Nam</option>
                          <option value={false}>Nữ</option>
                          <option value={""}>Khác</option>
                        </select>
                      ) : (
                        <p>{profile.gioiTinh == null ? "" : (value ? "Nam" : "Nữ")}</p>
                      )}
                    </div>
                  );
                }
                if (item.name === "ngaySinh") {
                  return (
                    <div key={index} className={styles.profileField}>
                      <label>{item.label}</label>

                      {isEditing ? (
                        <input
                          type="date"
                          name="ngaySinh"
                          value={value || ""}
                          onChange={handleChange}
                        />
                      ) : (
                        <p>{value}</p>
                      )}
                    </div>
                  );
                }
                return (
                  <Field
                    key={index}
                    label={item.label}
                    name={item.name}
                    value={value}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                );
              })}
              <div className={styles.profileActions}>
                <button onClick={toggleEdit} ref={typeSubmit}>
                  {isEditing ? "Lưu thông tin" : "Chỉnh sửa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Profile;

const Field = ({ label, name, value, isEditing, onChange }) => (
  <div className={styles.profileField}>
    <label>{label}</label>
    {isEditing ? (
      <input name={name} value={value || ""} onChange={onChange} />
    ) : (
      <p>{value}</p>
    )}
  </div>
);