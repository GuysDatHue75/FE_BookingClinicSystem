import React from 'react';
import { useEffect } from 'react';
import styles from './BookingGuide.module.css';
import Header from '../../../layouts/LayoutsUser/Header/Header';
import Footer from '../../../components/FooterComponent/Footer';

const BookingGuide = () => {
    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  return (
    <>
    <Header />
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hướng Dẫn & Quy Định Đặt Lịch Khám</h1>
        <p className={styles.subtitle}>
          Vui lòng đọc kỹ các thông tin dưới đây để quá trình thăm khám của bạn diễn ra thuận lợi và nhanh chóng nhất.
        </p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
       Quy trình đặt lịch khám
        </h2>
        <div className={styles.gridList}>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>1</span>
            <div className={styles.stepTitle}>Tạo/Đăng nhập tài khoản</div>
            <p>Đăng nhập vào hệ thống bằng số điện thoại. Nếu chưa có, vui lòng tạo tài khoản mới để hệ thống lưu trữ hồ sơ bệnh án.</p>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepTitle}>Chọn dịch vụ & Bác sĩ</div>
            <p>Lựa chọn chuyên khoa, bác sĩ mong muốn và khung giờ trống phù hợp với lịch trình của bạn.</p>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>3</span>
            <div className={styles.stepTitle}>Chờ xác nhận</div>
            <p>Sau khi gửi yêu cầu, hệ thống/bác sĩ sẽ xét duyệt. Bạn sẽ nhận được thông báo SMS/App khi lịch được xác nhận.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
           Quy định đặt lịch bắt buộc
        </h2>
        <ul className={styles.list}>
          <li className={styles.ruleItem}>
            <span className={styles.highlight}>Giới hạn lịch khám:</span> Mỗi bệnh nhân chỉ được tồn tại <strong>ĐỒNG THỜI 1 LỊCH KHÁM</strong> tại cùng một phòng khám.
          </li>
          <li className={styles.ruleItem}>
            <span className={styles.highlight}>Trạng thái lịch:</span> Bạn không thể đặt lịch khám thứ 2 nếu lịch khám thứ 1 <strong>chưa hoàn tất (chưa khám xong)</strong> hoặc <strong>chưa bị hủy/từ chối</strong> bởi bác sĩ.
          </li>
          <li className={styles.ruleItem}>
            <span className={styles.highlight}>Đúng giờ:</span> Khi lịch khám đã được xác nhận, vui lòng có mặt tại phòng khám sớm hơn giờ hẹn ít nhất 15 phút.
          </li>
          <li className={styles.ruleItem}>
            <span className={styles.highlight}>Hủy lịch:</span> Nếu không thể đến khám, vui lòng chủ động ấn "Hủy lịch" trên hệ thống trước <strong>ít nhất 2 tiếng</strong> để nhường suất cho bệnh nhân khác. Nếu vắng mặt không báo trước 3 lần, tài khoản sẽ bị tạm khóa tính năng đặt lịch.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
           Nhắc nhở: Cần mang gì khi đến khám?
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>Giấy tờ tùy thân hợp lệ có ảnh (Căn cước công dân / Hộ chiếu / Giấy khai sinh đối với trẻ em).</li>
          <li className={styles.listItem}>Thẻ Bảo hiểm y tế (BHYT) nếu bạn có nhu cầu khám theo diện bảo hiểm.</li>
          <li className={styles.listItem}>Sổ khám bệnh, các kết quả xét nghiệm, X-Quang, MRI hoặc đơn thuốc cũ (nếu có) trong vòng 6 tháng gần nhất.</li>
          <li className={styles.listItem}><strong>Lưu ý y khoa:</strong> Vui lòng nhịn ăn sáng (đối với khám tổng quát/xét nghiệm máu) hoặc nhịn tiểu (đối với siêu âm ổ bụng) theo chỉ định trước đó.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
           Tra cứu lịch sử khám bệnh
        </h2>
        <p>Phòng khám của chúng tôi áp dụng <strong>Bệnh án điện tử</strong>. Ngay sau khi bạn hoàn tất thanh toán và nhận thuốc, toàn bộ dữ liệu sẽ được đồng bộ lên tài khoản của bạn.</p>
        <div className={styles.actionBox}>
          <p>Để xem lại Chẩn đoán, Đơn thuốc số, hoặc Kết quả xét nghiệm:</p>
          <p>Truy cập: <strong>Menu Tài Khoản &gt; Lịch sử khám bệnh</strong></p>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default BookingGuide;