import styles from "./CreateClinic.module.css";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import Footer from "../../../components/FooterComponent/Footer";
import { useEffect, useState } from "react";
import apiClient from "../../../api/api";
import axios from "axios";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
const CreateClinic = () => {
  const [packages, setPackages] = useState([]);
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'primary',
    onConfirm: () => { }
  });
  const fields = [
    { id: "div1", name: "tenPhongKham", label: "Tên phòng khám", type: "text", placeholder: "Nhập tên phòng khám" },
    { id: "div2", name: "diaChi", label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ" },
    { id: "div3", name: "soDienThoai", label: "Số điện thoại liên hệ", type: "text", placeholder: "Nhập số điện thoại" },
    { id: "div4", name: "email", label: "Email phòng khám", type: "email", placeholder: "Nhập email" },
    { id: "div5", name: "loaiHinhPhongKham", label: "Loại hình phòng khám", type: "text", placeholder: "Ví dụ: Tư nhân, Liên doanh..." },
    { id: "div6", name: "nguoiDaiDien", label: "Tên người đại diện đăng ký", type: "text", placeholder: "Họ và tên" },
    { id: "div7", name: "soDienThoaiNguoiDaiDien", label: "Số điện thoại người đại diện", type: "text", placeholder: "Số điện thoại" },
    { id: "div8_1", name: "ngayThanhLap", id_class: "div8", label: "Ngày thành lập", type: "date" },
    { id: "div8_2", name: "giayPhep", id_class: "div8", label: "Giấy phép hoạt động", type: "file", isBase64: true },
    { id: "div9", name: "ngayCap", label: "Ngày cấp giấy phép", type: "date" },
    { id: "div15", name: "noiCap", label: "Nơi cấp giấy phép", type: "text", placeholder: "Nơi cấp" },
    { id: "div13", name: "anhPhongKham", label: "Ảnh phòng khám", type: "file", isBase64: true },
    { id: "div14", name: "tinhThanhPho", label: "Tỉnh/ Thành phố", isSelect: true },
    { id: "div11", name: "gioBatDauLamViec", label: "Giờ mở cửa", type: "time", placeholder: "Ví dụ: 8" },
    { id: "div12", name: "gioKetThucLamViec", label: "Giờ đóng cửa", type: "time", placeholder: "Ví dụ: 20" },
  ];
  const [formData, setFormData] = useState({
    tenPhongKham: "",
    diaChi: "",
    soDienThoai: "",
    email: "",
    loaiHinhPhongKham: "",
    nguoiDaiDien: "",
    soDienThoaiNguoiDaiDien: "",
    ngayThanhLap: "",
    giayPhep: "",
    ngayCap: "",
    noiCap: "",
    anhPhongKham: "",
    tinhThanhPho: "",
    gioBatDauLamViec: "",
    gioKetThucLamViec: "",
    moTa: "",
    trangThai: "ChoDuyet",
    maGoi: ""
  });

  const initialFormData = {
    tenPhongKham: "",
    diaChi: "",
    soDienThoai: "",
    email: "",
    loaiHinhPhongKham: "",
    nguoiDaiDien: "",
    soDienThoaiNguoiDaiDien: "",
    ngayThanhLap: "",
    giayPhep: "",
    ngayCap: "",
    noiCap: "",
    anhPhongKham: "",
    tinhThanhPho: "",
    gioBatDauLamViec: "",
    gioKetThucLamViec: "",
    moTa: "",
    trangThai: "ChoDuyet",
    maGoi: ""
  };
  const [formDataInit, setFormDataInit] = useState(initialFormData);

  useEffect(() => {
    const getData = async () => {
      axios.get("https://esgoo.net/api-tinhthanh/1/0.htm").then((res) => {
        if (res.data.error === 0) setProvinces(res.data.data);
      });
      const response = await apiClient.get('/api/v1/packages');
      setPackages(response.data);

    }
    getData();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));

  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, [name]: reader.result }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) newErrors[key] = "Trường này bắt buộc";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
      return;
    }
    try {
      const submitData = {
        ...formData,
        gioBatDauLamViec: formData.gioBatDauLamViec + ":00",
        gioKetThucLamViec: formData.gioKetThucLamViec + ":00",
      };
      const res = await apiClient.post("/api/v1/register-clinic", submitData);
      if (res.data === "Đăng ký thành công!") {
        setFormData(initialFormData);
        setErrors({});
        document.querySelectorAll('input[type="file"]').forEach(input => {
          input.value = "";
        });

        setModalConfig({
          isOpen: true,
          title: 'Đăng ký',
          message: 'Đăng ký phòng khám thành công!',
          type: 'success',
          onConfirm: () => {
            closeModal();

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        })
      }
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Đăng ký',
        message: 'Đăng ký phòng khám thất bại!',
        type: 'danger',
        onConfirm: () => closeModal()
      })
    }
  };
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false })
  return (
    <>
      <Header />
      <div className={styles.cliniContainer}>
        <h3 className={styles.sectionTitle}>Thông tin phòng khám</h3>
        <form className={styles.clinicForm}>
          <div className={styles.formGrid}>
            {fields.map((f) => (
              <div key={f.id} className={`${styles.formGroup} ${styles[f.id_class || f.id]}`}>
                <label>
                  <span style={{ color: "red" }}>*</span>
                  <span style={{ color: "black" }}> {f.label}</span>
                </label>
                {f.isSelect ? (
                  <select
                    name={f.name}
                    onChange={handleChange}
                    className={errors[f.name] ? styles.inputError : ""}
                    style={{ margin: "0", marginRight: "15px" }}
                  >
                    <option>Chọn tỉnh thành</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.full_name}>{p.full_name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    name={f.name}
                    {...(f.type !== "file" ? { value: formData[f.name] } : {})}
                    onChange={f.isBase64 ? handleFileChange : handleChange}
                    className={errors[f.name] ? styles.inputError : ""}
                  />
                )}

                {errors[f.name] && <span className={styles.errorText}>{errors[f.name]}</span>}
              </div>
            ))}
            <div className={`${styles.formGroup} ${styles.div10} ${styles.fullWidth}`}>
              <label>
                <span style={{ color: "red" }}>*</span>
                <span style={{ color: "black" }}> Miêu tả phòng khám</span>
              </label>
              <textarea name="moTa" onChange={handleChange} value={formData.moTa} placeholder="Nhập miêu tả..." rows="4" />
              {errors.moTa && <span className={styles.errorText}>{errors.moTa}</span>}
            </div>
          </div>
        </form>

        <h3 className={styles.sectionTitle}>*Chọn gói đăng ký</h3>
        {packages.length > 0 ? (
          <div className={styles.planContainer}>
            {packages.map((item) => {
              const isSelected = formData.maGoi === item.maGoi;

              return (
                <div
                  key={item.maGoi}
                  className={`${styles.plan} ${isSelected ? styles.selected : ""}`}
                  onClick={() => {
                    setFormData({ ...formData, maGoi: item.maGoi });
                    setErrors((prev) => ({ ...prev, maGoi: "" }));
                  }}
                >
                  <h4 >
                    {item.tenGoi}
                  </h4>
                  <p>
                    {item.tenGoi === "Free"
                      ? "Miễn phí"
                      : `${item.gia.toLocaleString('vi-VN')} VND/Tháng`}
                  </p>

                  <ul>
                    {item.tinhNangs.map((feature, index) => (
                      <li key={index}>{feature.tenTinhNang}</li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`${styles.btn} ${isSelected ? styles.btnSelected : styles.btnFree}`}
                  >
                    {isSelected ? "Đã chọn" : "Chọn gói"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Hiện chưa có gói đăng ký nào.</p>
        )}
        {errors.maGoi && (
          <span className={styles.errorText} >
            {errors.maGoi}
          </span>
        )}
        <div className={styles.submitContainer}>
          <button onClick={handleSubmit} className={styles.btnSubmit}>Gửi yêu cầu</button>
        </div>
      </div>
      <ConfirmModal {...modalConfig} onCancel={closeModal} />
      <Footer />
    </>
  );
};

export default CreateClinic;
