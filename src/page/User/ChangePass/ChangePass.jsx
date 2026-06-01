import Header from "../../../layouts/LayoutsUser/Header/Header";
import styles from "./ChangePass.module.css";
import { useEffect, useState } from "react";

const ChangePass = () => {
    const role = localStorage.getItem("role");
    const [form, setForm] = useState({
        idAccount: localStorage.getItem("idAccount"),
        oldPass: "",
        newPass: "",
        confirmNewPass: "",
        captcha: "",
        captchaId: "",
    });

    const [captchaImg, setCaptchaImg] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchCaptcha = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/captcha");
            const data = await res.json();

            setCaptchaImg(`data:image/jpeg;base64,${data.imageBase64}`);
            setForm((prev) => ({
                ...prev,
                captchaId: data.captchaId,
                captcha: ""
            }));
        } catch (err) {
            setMessage("Không tải được captcha");
        }
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.oldPass || !form.newPass || !form.captcha) {
            setMessage("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        if (form.newPass !== form.confirmNewPass) {
            setMessage("Mật khẩu nhập lại không khớp");
            return;
        }

        setLoading(true);
        setMessage("Đang xử lý...");

        try {
            const res = await fetch("http://localhost:8080/api/v1/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(data.message);
                setForm((prev) => ({
                    ...prev,
                    oldPass: "",
                    newPass: "",
                    confirmNewPass: "",
                    captcha: "",
                }));
            } else {
                setMessage(data.message);
                fetchCaptcha();
            }

        } catch (err) {
            setMessage("Lỗi kết nối server");
        }

        setLoading(false);
    };

    return (
        <>
            {role == "BenhNhan" && <Header />}
            <div className={role == "BenhNhan" ? styles.container : styles.containerOther}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Đổi mật khẩu</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            name="oldPass"
                            placeholder="Mật khẩu cũ"
                            value={form.oldPass}
                            onChange={handleChange}
                            className={styles.input}
                        />

                        <input
                            type="password"
                            name="newPass"
                            placeholder="Mật khẩu mới"
                            value={form.newPass}
                            onChange={handleChange}
                            className={styles.input}
                        />

                        <input
                            type="password"
                            name="confirmNewPass"
                            placeholder="Nhập lại mật khẩu mới"
                            value={form.confirmNewPass}
                            onChange={handleChange}
                            className={styles.input}
                        />

                        <div className={styles.captchaBox}>
                            <img src={captchaImg} alt="captcha" className={styles.captchaImg} />
                            <button
                                type="button"
                                onClick={fetchCaptcha}
                                className={styles.reloadBtn}
                            >
                                🔄
                            </button>
                        </div>

                        <input
                            type="text"
                            name="captcha"
                            placeholder="Nhập captcha"
                            value={form.captcha}
                            onChange={handleChange}
                            className={styles.input}
                        />

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Xác nhận"}
                        </button>
                    </form>

                    <p className={styles.message}>{message}</p>
                </div>
            </div>
        </>
    );
};

export default ChangePass;