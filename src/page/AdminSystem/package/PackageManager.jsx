import React, { useState, useEffect } from "react";
import styles from "./PackageManager.module.css";
import subscriptionPackageService from "../../../services/admin/SubPackageService";
import featureService from "../../../services/admin/FeatureService"; 

const PackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  // Khớp State với DTO Backend
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    selectedFeatureIds: [], // 💥 SỬA LẠI: Dùng mảng lưu ID tính năng
    status: "Đang kích hoạt", 
  });

  // 1. GỌI API LẤY MASTER DATA TÍNH NĂNG
  useEffect(() => {
    const fetchMasterFeatures = async () => {
      try {
        const response = await featureService.getAllFeatures();
        const data = response.data || response;
        setAvailableFeatures(data || []);
      } catch (error) {
        console.error("Lỗi lấy Master Data tính năng:", error);
      }
    };
    fetchMasterFeatures();
  }, []);

  // 2. GỌI API LẤY DANH SÁCH GÓI
  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const searchPayload = {
        keyword: searchTerm.trim() || null,
        trangThai: null,
        thoiHanNgay: null,
        page: 0,
        size: 50, 
        sortBy: "tenGoi",
        sortDirection: "asc"
      };

      const response = await subscriptionPackageService.searchSubscriptionpackage(searchPayload);
      const responseData = response.data || response;
      
      setPackages(responseData.content || []);
    } catch (error) {
      console.error("Lỗi tải danh sách gói đăng ký:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data khi vào trang và Debounce khi search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPackages();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 💥 THÊM: Logic khi tick/bỏ tick Checkbox Tính năng
  const handleFeatureToggle = (maTinhNang) => {
    setFormData((prev) => {
      const isSelected = prev.selectedFeatureIds.includes(maTinhNang);
      if (isSelected) {
        return { ...prev, selectedFeatureIds: prev.selectedFeatureIds.filter(id => id !== maTinhNang) };
      } else {
        return { ...prev, selectedFeatureIds: [...prev.selectedFeatureIds, maTinhNang] };
      }
    });
  };

  // 3. TẠO & CẬP NHẬT GÓI
  const handleSubmitPackage = async (e) => {
    e.preventDefault();
    
    if (formData.selectedFeatureIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 tính năng cho gói này!");
      return;
    }

    const payload = {
      maGoi: editingPackage ? editingPackage.maGoi : null,
      tenGoi: formData.name,
      gia: parseFloat(formData.price),
      thoiHanNgay: parseInt(formData.duration),
      moTa: formData.description,
      trangThai: formData.status,
      danhSachMaTinhNang: formData.selectedFeatureIds // 💥 Truyền mảng ID chuẩn Backend
    };

    try {
      if (editingPackage) {
        await subscriptionPackageService.updateSubscriptionpackage(editingPackage.maGoi, payload);
        alert("Cập nhật gói thành công!");
      } else {
        await subscriptionPackageService.createSubscriptionpackage(payload);
        alert("Tạo gói mới thành công!");
      }
      
      setShowCreateForm(false);
      setEditingPackage(null);
      resetForm();
      fetchPackages(); // Load lại data
    } catch (error) {
      console.error("Lỗi lưu gói đăng ký:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // 4. XÓA GÓI
  const handleDeletePackage = async (maGoi) => {
    try {
      await subscriptionPackageService.deleteSubscriptionpackage(maGoi);
      alert("Xóa gói đăng ký thành công!");
      setShowDeleteConfirm(false);
      setPackageToDelete(null);
      fetchPackages();
    } catch (error) {
      console.error("Lỗi xóa gói:", error);
      alert("Lỗi! Không thể xóa gói này.");
    }
  };

  // Mở form chỉnh sửa, nạp dữ liệu cũ vào
  const openEditForm = (pkg) => {
    setEditingPackage(pkg);
    // 💥 Nạp mảng ID từ Object danhSachTinhNang do Backend trả về
    const matchedFeatureIds = pkg.danhSachTenTinhNang 
      ? pkg.danhSachTenTinhNang.map(f => f.maTinhNang) 
      : [];

    setFormData({
      name: pkg.tenGoi,
      price: pkg.gia,
      duration: pkg.thoiHanNgay,
      description: pkg.moTa || "",
      selectedFeatureIds: matchedFeatureIds, // 💥 Truyền mảng ID vào form
      status: pkg.trangThai || "Đang kích hoạt",
    });
    setShowCreateForm(true);
  };

  const prepareDeletePackage = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    // 💥 Trả selectedFeatureIds về mảng rỗng
    setFormData({
      name: "", price: "", duration: "", description: "", selectedFeatureIds: [], status: "Đang kích hoạt",
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý Gói Đăng ký</h1>
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên gói..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

        <button className={styles.createButton} onClick={() => {resetForm(); setEditingPackage(null); setShowCreateForm(true);}}>
          + Tạo gói mới
        </button>
      </div>

      {/* FORM MODAL */}
      {showCreateForm && (
        <div className={styles.formModal}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>
              {editingPackage ? "Chỉnh sửa gói" : "Tạo gói mới"}
            </h2>

            <form onSubmit={handleSubmitPackage}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tên gói *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={styles.input} required />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Giá (VND) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={styles.input} min="0" required />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Thời hạn (ngày) *</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} className={styles.input} min="1" required />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Trạng thái</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className={styles.select}>
                    <option value="Đang kích hoạt">Đang kích hoạt</option>
                    <option value="Ngừng kích hoạt">Ngừng kích hoạt</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Mô tả *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className={styles.textarea} rows="2" required />
              </div>

              {/* 💥 DANH SÁCH CHECKBOX TÍNH NĂNG */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Tính năng của gói (Chọn ít nhất 1) *</label>
                <div className={styles.featureChecklist}>
                  {availableFeatures.map((feature) => (
                    <label key={feature.maTinhNang} className={styles.featureCheckboxItem}>
                      <input
                        type="checkbox"
                        checked={formData.selectedFeatureIds.includes(feature.maTinhNang)}
                        onChange={() => handleFeatureToggle(feature.maTinhNang)}
                      />
                      <span className={styles.featureName}>{feature.tenTinhNang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formButtons}>
                <button type="submit" className={styles.saveButton}>
                  {editingPackage ? "Cập nhật" : "Tạo mới"}
                </button>
                <button type="button" className={styles.cancelButton} onClick={() => setShowCreateForm(false)}>
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showDeleteConfirm && packageToDelete && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmContainer}>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa gói "{packageToDelete.tenGoi}"?</p>
            <div className={styles.confirmButtons}>
              <button className={styles.confirmButton} onClick={() => handleDeletePackage(packageToDelete.maGoi)}>
                Xóa
              </button>
              <button className={styles.cancelButton} onClick={() => setShowDeleteConfirm(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIỂN THỊ DANH SÁCH GÓI DẠNG CARD */}
      {isLoading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
      ) : (
        <div className={styles.packagesGrid}>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg.maGoi} className={styles.packageCard}>
                
                {/* Header Gói */}
                <div className={styles.packageHeader}>
                  <h3 className={styles.packageName}>{pkg.tenGoi}</h3>
                  <div className={styles.packagePrice}>
                    {pkg.gia === 0 ? "Miễn phí" : formatCurrency(pkg.gia)}
                    <span className={styles.pricePeriod}>/tháng</span>
                  </div>
                </div>

                <div className={styles.packageDescription}>{pkg.moTa}</div>

                {/* 💥 Tính năng (Map từ danhSachTinhNang dạng Object) */}
                <div className={styles.packageFeatures}>
                  <h4>Tính năng bao gồm:</h4>
                  <ul>
                    {pkg.danhSachTenTinhNang && pkg.danhSachTenTinhNang.map((feature) => (
                      <li key={feature.maTinhNang}>{feature.tenTinhNang}</li>
                    ))}
                  </ul>
                </div>

                {/* Thông tin Meta */}
                <div className={styles.packageMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Thời hạn:</span>
                    <span className={styles.metaValue}>{pkg.thoiHanNgay} ngày</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Trạng thái:</span>
                    <span className={pkg.trangThai === "Đang kích hoạt" ? styles.metaValue : styles.metaValue} style={{color: pkg.trangThai === "Đang kích hoạt" ? '#2ecc71' : '#e74c3c'}}>
                      {pkg.trangThai}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Ngày tạo:</span>
                    <span className={styles.metaValue}>N/A</span>
                  </div>
                </div>

                {/* Nút thao tác */}
                <div className={styles.packageActions}>
                  <button className={styles.editButton} onClick={() => openEditForm(pkg)}>
                    Chỉnh sửa
                  </button>
                  <button className={styles.deleteButton} onClick={() => prepareDeletePackage(pkg)}>
                    Xóa
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noData}>Không tìm thấy gói đăng ký nào</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageManager;