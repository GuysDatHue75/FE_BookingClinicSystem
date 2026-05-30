import React, { useState, useEffect } from "react";
import styles from "./NewsEditor.module.css";
import newsService from "../../../services/clinic/NewsService";

const NewsFormModal = ({ initialData, onClose, onSuccess }) => {
  const isEditMode = !!initialData;
  const idPhongKham = localStorage.getItem("idPhongKham");

  const [news, setNews] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    imagePreview: null,
  });

  useEffect(() => {
    if (isEditMode) {
      setNews({
        title: initialData.tieuDe || "",
        summary: initialData.moTaNgan || "",
        content: initialData.noiDung || "",
        image: initialData.anh || "",
        imagePreview: initialData.anh ? `http://localhost:8080/${initialData.anh}` : null,
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNews((prev) => ({ ...prev, image: file, imagePreview: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setNews((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Tạo FormData để xử lý MultipartFile
    const payload = new FormData();
    payload.append("tieuDe", news.title);
    payload.append("moTaNgan", news.summary);
    payload.append("noiDung", news.content);
    
    // Nếu image là File (người dùng vừa chọn ảnh mới), ta gửi lên
    if (news.image instanceof File) {
      payload.append("anh", news.image);
    }

    try {
      if (isEditMode) {
        await newsService.updateNews( initialData.maTinTuc, idPhongKham, payload);
        alert("Cập nhật tin tức thành công!");
      } else {
        await newsService.createNews(idPhongKham, payload);
        alert("Đăng tin tức thành công!");
      }
      onSuccess();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
      <div className={styles.mainContent} style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 className={styles.title}>{isEditMode ? "Sửa tin tức" : "Soạn tin tức mới"}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tiêu đề tin tức *</label>
            <input type="text" name="title" value={news.title} onChange={handleChange} className={styles.titleInput} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tóm tắt (Mô tả ngắn) *</label>
            <textarea name="summary" value={news.summary} onChange={handleChange} className={styles.summaryInput} rows="3" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nội dung chi tiết *</label>
            <textarea name="content" value={news.content} onChange={handleChange} className={styles.contentInput} rows="10" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ảnh đại diện</label>
            <div className={styles.imageUpload}>
              <input type="file" id="image" name="image" onChange={handleChange} className={styles.fileInput} accept="image/*" />
              {news.imagePreview ? (
                <div className={styles.imagePreviewContainer}>
                  <img src={news.imagePreview} alt="Preview" className={styles.imagePreview} />
                  <button type="button" className={styles.removeImageButton} onClick={() => setNews((prev) => ({ ...prev, image: null, imagePreview: null }))}>×</button>
                </div>
              ) : (
                <label htmlFor="image" className={styles.uploadPlaceholder}>
                  <span className={styles.uploadIcon}>+</span>
                  <span>Chọn ảnh đại diện mới</span>
                </label>
              )}
            </div>
          </div>

          <div className={styles.footerActions} style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Hủy bỏ</button>
            <button type="submit" className={styles.publishButton}>{isEditMode ? "Lưu thay đổi" : "Xuất bản tin tức"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsFormModal;