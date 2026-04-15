import React, { useContext, useState } from "react";
import "./../Profile.css";
import avatarDoctorProfile from "./../../../../../assets/image/user-avt.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { State } from "../../../../../state/context";

const EditProfile = () => {
  const initialDoctorInfo = {
    avatar: avatarDoctorProfile,
    name: "TS. HOÀNG VIỆT THẮNG",
    specialty: "CHUYÊN KHOA NỘI TIM MẠCH",
    gender: "Nam",
    birthday: "22/12/1985",
    address: "Yên Thành, Nghệ An",
    phone: "0831212345",
    email: "ThangCon0808@gmail.com",
    careerGoals: [
      "Phấn đấu nâng cao kĩ năng, kiến thức chuyên môn",
      "Tạo môi trường làm việc thoải mái, thân thiện với bệnh nhân và bác sĩ",
      "Hết mình với công việc, đặt bệnh nhân lên hàng đầu",
    ],
    education: [
      {
        label: "Chức danh",
        value: "Trưởng khoa nội - Bệnh viện Trung ương Huế",
      },
      { label: "Học vị", value: "Tiến sĩ Y học. BCNT chuyên ngành nội" },
      { label: "Chứng chỉ", value: "Siêu âm, nội soi tim" },
      { label: "Hội viên", value: "Hội tim mạch Việt Nam, Hội nội khoa Huế" },
      { label: "Kinh nghiệm", value: "20 năm trong lĩnh vực Nội tim mạch" },
    ],
    activities: [
      {
        date: "2004 - 2011",
        description: [
          "Công tác tại bệnh viện Bạch Mai - Hà nội, chuyên khoa Tim Mạch",
          "2010 Phó khoa Nội Tim mạch.",
        ],
        image:
          "https://tse3.mm.bing.net/th/id/OIP.LCQTbFcaQv3zUK1FBdVzjwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        date: "2011 - 2019",
        description: [
          "Công tác tại bệnh viện Bạch Mai - Hà nội, chuyên khoa Tim Mạch",
          "2010 Phó khoa Nội Tim mạch.",
        ],
        image:
          "https://cdn-healthcare.hellohealthgroup.com/2022/08/1661238877_63047e5d649eb0.48767792.jpg",
      },
      {
        date: "2019 - 2025",
        description: [
          "Công tác tại bệnh viện Bạch Mai - Hà nội, chuyên khoa Tim Mạch",
          "2010 Phó khoa Nội Tim mạch.",
        ],
        image:
          "https://tse4.mm.bing.net/th/id/OIP.8bF7-GjeEOEx1DfEV790VQHaGe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      },
    ],
  };

  const [doctorInfo, setDoctorInfo] = useState(initialDoctorInfo);
  const [editingField, setEditingField] = useState(null);
  const { image, setImage } = useContext(State);
  const handleChange = (e, index = null, type = null) => {
    const { name, value } = e.target;
    if (type === "careerGoals") {
      const newGoals = [...doctorInfo.careerGoals];
      newGoals[index] = value;
      setDoctorInfo({ ...doctorInfo, careerGoals: newGoals });
    } else if (type === "education") {
      const newEdu = [...doctorInfo.education];
      newEdu[index].value = value;
      setDoctorInfo({ ...doctorInfo, education: newEdu });
    } else if (type === "activities") {
      const newAct = [...doctorInfo.activities];
      newAct[index].description[0] = value;
      setDoctorInfo({ ...doctorInfo, activities: newAct });
    } else {
      setDoctorInfo({ ...doctorInfo, [name]: value });
    }
  };

  const handleUpdate = () => {
    toast.success("Cập nhật thông tin thành công!", { position: "top-center" });
  };

  const handleCancel = () => {
    setDoctorInfo(initialDoctorInfo);
    setEditingField(null);
  };

  // Chọn avatar mới
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDoctorInfo((prev) => ({
        ...prev, // giữ nguyên tất cả thông tin cũ
        avatar: url, // chỉ cập nhật avatar
      }));
    }
  };

  const handleActivityImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newAct = [...doctorInfo.activities];
      newAct[index].image = url;
      setDoctorInfo({ ...doctorInfo, activities: newAct });
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-left-column">
          <div className="avatar-section" style={{ position: "relative" }}>
            <img
              src={doctorInfo.avatar}
              alt="Avatar Bác sĩ"
              className="doctor-avatar"
            />
            <label
              htmlFor="avatar-upload"
              style={{
                position: "absolute",
                bottom: 15,
                right: 15,
                cursor: "pointer",
                background: "#fff",
                padding: "5px",
                borderRadius: "50%",
              }}
            >
              <i className="fas fa-edit"></i>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setImage(url);
                  setDoctorInfo({ ...doctorInfo, avatar: url });
                }
              }}
            />
          </div>

          <div className="info-section contact-info">
            <h4>Thông Tin Liên Hệ</h4>
            <ul>
              {["gender", "birthday", "address", "phone", "email"].map(
                (field, idx) => (
                  <li key={idx}>
                    {editingField === field ? (
                      <input
                        type="text"
                        name={field}
                        value={doctorInfo[field]}
                        onChange={handleChange}
                        autoFocus
                      />
                    ) : (
                      <>
                        <span>{doctorInfo[field]}</span>
                        <i
                          className="fas fa-edit"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() => setEditingField(field)}
                        ></i>
                      </>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Mục tiêu nghề nghiệp */}
          <div className="info-section career-objective">
            <h4>Mục Tiêu Nghề Nghiệp</h4>
            <ul>
              {doctorInfo.careerGoals.map((goal, idx) => (
                <li key={idx}>
                  {editingField === `careerGoals-${idx}` ? (
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => handleChange(e, idx, "careerGoals")}
                      autoFocus
                    />
                  ) : (
                    <>
                      {goal}
                      <i
                        className="fas fa-edit"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() => setEditingField(`careerGoals-${idx}`)}
                      ></i>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Đánh giá */}
          <div className="info-section rating-section">
            <h4>Đánh Giá Công Tác khám </h4>
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className="profile-right-column">
          <div className="right-box">
            <div className="right-header">
              {["name", "specialty"].map((field, idx) =>
                editingField === field ? (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={doctorInfo[field]}
                    onChange={handleChange}
                    autoFocus
                    style={{
                      fontSize: field === "name" ? "1.5rem" : "1rem",
                      fontWeight: field === "name" ? "bold" : "normal",
                      width: "100%",
                    }}
                  />
                ) : (
                  <div
                    key={field}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {field === "name" ? (
                      <h2>{doctorInfo.name}</h2>
                    ) : (
                      <p>{doctorInfo.specialty}</p>
                    )}
                    <i
                      className="fas fa-edit"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditingField(field)}
                    ></i>
                  </div>
                )
              )}
            </div>

            {/* Học vấn */}
            <div className="right-section education">
              <h3>
                <i className="fas fa-graduation-cap"></i> HỌC VẤN
              </h3>
              <ul>
                {(doctorInfo.education || []).map((item, idx) => (
                  <li key={idx}>
                    <span>{item.label}:</span>
                    {editingField === `education-${idx}` ? (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleChange(e, idx, "education")}
                        autoFocus
                      />
                    ) : (
                      <>
                        <span>{item.value}</span>
                        <i
                          className="fas fa-edit"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() => setEditingField(`education-${idx}`)}
                        ></i>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hoạt động */}
            <div className="right-section activities">
              <h3>
                <i className="fas fa-flag"></i> HOẠT ĐỘNG
              </h3>
              <div className="timeline-container">
                {doctorInfo.activities.map((act, idx) => (
                  <div className="timeline-item" key={idx}>
                    <span className="timeline-date">{act.date}</span>
                    <div className="timeline-content">
                      <ul>
                        {act.description.map((desc, i) => (
                          <li key={i}>
                            {editingField === `activities-${idx}-${i}` ? (
                              <input
                                type="text"
                                value={desc}
                                onChange={(e) =>
                                  handleChange(e, idx, "activities")
                                }
                                autoFocus
                              />
                            ) : (
                              <>
                                {desc}
                                <i
                                  className="fas fa-edit"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "5px",
                                  }}
                                  onClick={() =>
                                    setEditingField(`activities-${idx}-${i}`)
                                  }
                                ></i>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>

                      <div style={{ position: "relative" }}>
                        <img
                          src={act.image}
                          alt={`Hoạt động ${idx + 1}`}
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "cover",
                          }}
                        />
                        <label
                          htmlFor={`activity-upload-${idx}`}
                          style={{
                            position: "absolute",
                            bottom: 5,
                            right: 5,
                            cursor: "pointer",
                            background: "#fff",
                            padding: "3px",
                            borderRadius: "3px",
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </label>
                        <input
                          id={`activity-upload-${idx}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleActivityImageChange(e, idx)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nút Cập nhật / Hủy bỏ */}
      <div
        style={{
          width: "90%",
          maxWidth: "900px",
          margin: "20px auto",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <button
          onClick={handleUpdate}
          style={{
            backgroundColor: "#1B7EEE",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Cập nhật
        </button>
        <button onClick={handleCancel}>Hủy bỏ</button>
      </div>
    </>
  );
};

export default EditProfile;
