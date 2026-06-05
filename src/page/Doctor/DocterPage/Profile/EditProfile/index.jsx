import React, { useContext, useState, useEffect } from "react";
import styles from "./EditProfile.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { State } from "../../../../../state/context";
import apiClient from "../../../../../api/api";

const EditProfile = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { image, setImage } = useContext(State);

  const maBacSi = localStorage.getItem("idDoctor") || localStorage.getItem("maBacSi") || "BS001";

  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0 });
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/v1/doctor/profile/${maBacSi}`);
      const data = response.data;
      console.log(data);
      
      // MAPPING ĐẦU VÀO: Chuyển đổi cấu trúc Entity lồng nhau về dạng phẳng chuẩn DTO
      setFormData({
        hoVaTen: data.hoVaTen || data.tenBacSi || "",
        soDienThoai: data.soDienThoai || "",
        ngaySinh: data.ngaySinh ? data.ngaySinh.substring(0, 10) : "", // Định dạng YYYY-MM-DD cho thẻ input date
        gioiTinh: data.gioiTinh ?? true,
        diaChi: data.diaChi || "",
        anhDaiDien: data.anhDaiDien || "",
        cccd: data.cccd || "",
        maChuyenKhoa: data.maChuyenKhoa || "",
        maPhongKham: data.maPhongKham || "",
        bangCap: data.bangCap || "",
        kinhNghiem: data.kinhNghiem || "",
        hoatDong: data.hoatDong || "",
        mieuTa1: data.mieuTa1 || "",
        mieuTa2: data.mieuTa2 || "",
        chucVu: data.chucVu || "",
        hocHam: data.hocHam || "",
        soGiayPhep: data.soGiayPhep || "",
        noiCap: data.noiCap || "",
        ngayCap: data.ngayCap ? data.ngayCap.substring(0, 10) : "", // Lấy phần date YYYY-MM-DD
        email: data.email || "" // Trường hiển thị/không sửa đổi trong DTO tùy cấu hình
      });
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
      setFormData((prev) => ({ ...prev, [name]: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        ngayCap: formData.ngayCap ? `${formData.ngayCap}T00:00:00` : null
      };
      console.log("1. NÚT CẬP NHẬT ĐÃ ĐƯỢC BẤM!");
      console.log("2. DỮ LIỆU (PAYLOAD) CHUẨN BỊ GỬI ĐI LÀ:", payload);
      const response = await apiClient.put(`/api/v1/doctor/profile/${maBacSi}`, payload);
      toast.success("Cập nhật thông tin hồ sơ thành công!");

      // >>> ĐỒNG BỘ ẢNH LÊN HEADER NGAY LẬP TỨC KHÔNG CẦN F5 <<<
      if (formData.anhDaiDien && formData.anhDaiDien.startsWith("data:image/")) {
        setImage(formData.anhDaiDien); // Cập nhật Context chung để Header đổi ảnh theo
        localStorage.setItem("doctorAvatar", formData.anhDaiDien); // Lưu lại để khi F5 không mất ảnh
      }


      const updatedDto = response.data;
      setFormData({
        ...updatedDto,
        ngaySinh: updatedDto.ngaySinh ? updatedDto.ngaySinh.substring(0, 10) : "",
        ngayCap: updatedDto.ngayCap ? updatedDto.ngayCap.substring(0, 10) : ""
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error(error.response?.data?.message || "Cập nhật thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy bỏ mọi thay đổi hiện tại?")) {
      fetchDoctorProfile();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log("3. ĐÃ CHỌN FILE TỪ MÁY TÍNH:", file);
    if (file) {
      if (file.size > 500 * 1024) {
        toast.error("Ảnh không được vượt quá 500KB!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log("4. ĐÃ CHUYỂN ẢNH SANG BASE64 THÀNH CÔNG! Độ dài chuỗi:", base64String.length);

        setFormData((prev) => ({
          ...prev,
          anhDaiDien: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className={styles.loadingState}>Đang tải dữ liệu hồ sơ chỉnh sửa...</div>;
  if (!formData) return <div className={styles.errorState}>Không tải được biểu mẫu!</div>;

  // Bổ sung thêm điều kiện kiểm tra chuỗi dữ liệu "data:image/" để hiển thị trực tiếp chuỗi Base64
  const avatarUrl = formData.anhDaiDien
    ? (formData.anhDaiDien.startsWith("http") || formData.anhDaiDien.startsWith("blob") || formData.anhDaiDien.startsWith("data:image/"))
      ? formData.anhDaiDien
      : `http://localhost:8080/uploads/${formData.anhDaiDien}`
    : image;

  return (
    <form onSubmit={handleUpdate} className={styles.editProfileWrapper}>

      {/* ================= CỘT TRÁI: AVATAR & THÔNG TIN CÁ NHÂN HÀNH CHÍNH ================= */}
      <div className={styles.sidebar}>
        <div className={styles.avatarCard}>
          <div className={styles.avatarContainer}>
            <img src={avatarUrl} alt="Avatar Bác sĩ" className={styles.avatarImage} />
            <label htmlFor="avatar-upload" className={styles.avatarEditBadge} title="Thay đổi ảnh đại diện">
              <i className="fa-solid fa-camera"></i>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>
          <p className={styles.sidebarHint}>Nhấn vào biểu tượng camera để thay đổi ảnh</p>
        </div>

        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>Thông Tin Cá Nhân Bản Thân</h3>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Họ và Tên bác sĩ *</label>
            <input type="text" name="hoVaTen" value={formData.hoVaTen} onChange={handleChange} required className={styles.formInput} />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Giới tính</label>
            <select name="gioiTinh" value={formData.gioiTinh.toString()} onChange={handleChange} className={styles.formSelect}>
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Ngày sinh</label>
            <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} className={styles.formInput} />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Số CCCD / Định danh *</label>
            <input type="text" name="cccd" value={formData.cccd} onChange={handleChange} required className={styles.formInput} />
          </div>
        </div>

        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>Thông Tin Liên Lạc</h3>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Số điện thoại liên hệ *</label>
            <input type="text" name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} required className={styles.formInput} />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Địa chỉ Email (Đọc dữ liệu)</label>
            <input type="email" name="email" value={formData.email} disabled className={`${styles.formInput} ${styles.disabledInput}`} />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Địa chỉ nơi ở hiện tại</label>
            <input type="text" name="diaChi" value={formData.diaChi} onChange={handleChange} className={styles.formInput} />
          </div>
        </div>
      </div>

      {/* ================= CỘT PHẢI: QUẢN LÝ CHUYÊN MÔN & THÔNG TIN PHÁP LÝ Y TẾ ================= */}
      <div className={styles.mainContent}>

        {/* Khối tiểu sử tóm tắt */}
        <div className={styles.formCard}>
          <h3 className={styles.sectionTitle}><i className="fa-solid fa-user-doctor"></i> Tóm Tắt Tiểu Sử Nghề Nghiệp (Mục tiêu)</h3>
          <div className={styles.inputGroup}>
            <textarea name="mieuTa1" rows="4" value={formData.mieuTa1} onChange={handleChange} className={styles.formTextarea} placeholder="Nhập tóm tắt quá trình làm việc, giới thiệu tổng quan bản thân..." />
          </div>
        </div>

        {/* Khối vị trí công tác & chuyên khoa */}
        <div className={styles.formCard}>
          <h3 className={styles.sectionTitle}><i className="fa-solid fa-briefcase"></i> Chuyên Khoa & Vị Trí Cấp Bậc</h3>
          <div className={styles.grid2Col}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Chức vụ đảm nhiệm *</label>
              <input type="text" name="chucVu" value={formData.chucVu} onChange={handleChange} required className={styles.formInput} placeholder="Ví dụ: Trưởng khoa Nội" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Học hàm / Học vị *</label>
              <input type="text" name="hocHam" value={formData.hocHam} onChange={handleChange} required className={styles.formInput} placeholder="Ví dụ: Phó Giáo sư / Tiến sĩ" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Mã chuyên khoa quản lý *</label>
              <input type="text" name="maChuyenKhoa" value={formData.maChuyenKhoa} onChange={handleChange} required className={styles.formInput} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Bằng cấp chuyên môn *</label>
              <input type="text" name="bangCap" value={formData.bangCap} onChange={handleChange} required className={styles.formInput} />
            </div>
          </div>
        </div>

        {/* Khối kinh nghiệm thực tế */}
        <div className={styles.formCard}>
          <h3 className={styles.sectionTitle}><i className="fa-solid fa-mortar-board"></i> Thâm Niên Khám Chữa & Hoạt Động</h3>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Kinh nghiệm làm việc tổng quan</label>
            <input type="text" name="kinhNghiem" value={formData.kinhNghiem} onChange={handleChange} className={styles.formInput} placeholder="Ví dụ: 25 năm kinh nghiệm hành nghề" />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Hoạt động điều trị chi tiết</label>
            <textarea name="hoatDong" rows="3" value={formData.hoatDong} onChange={handleChange} className={styles.formTextarea} placeholder="Mô tả các đầu bệnh lý nhận điều trị..." />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Thế mạnh chuyên môn sâu</label>
            <textarea name="mieuTa2" rows="3" value={formData.mieuTa2} onChange={handleChange} className={styles.formTextarea} placeholder="Ví dụ: Chuyên môn sâu về can thiệp tim mạch bẩm sinh..." />
          </div>
        </div>

        {/* Khối pháp lý chứng chỉ y khoa */}
        <div className={styles.formCard}>
          <h3 className={styles.sectionTitle}><i className="fa-solid fa-id-card-clip"></i> Giấy Phép Hành Nghề Khám Bệnh</h3>
          <div className={styles.grid2Col}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Số giấy phép (CCHN) *</label>
              <input type="text" name="soGiayPhep" value={formData.soGiayPhep} onChange={handleChange} required className={`${styles.formInput} ${styles.highlightInput}`} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Cơ quan cấp phép *</label>
              <input type="text" name="noiCap" value={formData.noiCap} onChange={handleChange} required className={styles.formInput} />
            </div>
          </div>
          <div className={styles.inputGroup} style={{ marginTop: '15px' }}>
            <label className={styles.inputLabel}>Ngày cấp phép giấy phép hành nghề</label>
            <input type="date" name="ngayCap" value={formData.ngayCap} onChange={handleChange} className={styles.formInput} />
          </div>
        </div>

        {/* THANH ĐIỀU KHIỂN HÀNH ĐỘNG FORM */}
        <div className={styles.actionControlBar}>
          <button type="button" onClick={handleCancel} disabled={submitting} className={styles.btnCancel}>
            Hủy Thay Đổi
          </button>
          <button type="submit" disabled={submitting} className={styles.btnSubmit}>
            {submitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Đang Lưu Hồ Sơ...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i> Cập Nhật Toàn Bộ
              </>
            )}
          </button>
        </div>

      </div>
    </form>
  );
};

export default EditProfile;