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
            Hướng dẫn viết Prompt cho Trợ lý AI
          </h2>

          <p className={styles.introText}>
            Trợ lý AI có thể hỗ trợ tìm kiếm bác sĩ, phòng khám, giải thích triệu chứng
            và tư vấn thông tin sức khỏe cơ bản. Để nhận được kết quả chính xác,
            bạn nên mô tả rõ ràng nhu cầu của mình.
          </p>

          <div className={styles.promptContainer}>
            <div className={styles.promptCard}>
              <h3>Tìm bác sĩ theo chuyên khoa</h3>
              <div className={styles.promptExample}>
                "Tôi bị đau dạ dày kéo dài, hãy tìm bác sĩ chuyên khoa Tiêu hóa tại TP.HCM."
              </div>
            </div>

            <div className={styles.promptCard}>
              <h3>Tìm phòng khám gần khu vực</h3>
              <div className={styles.promptExample}>
                "Tìm phòng khám Tai Mũi Họng gần Quận 7 có lịch khám vào cuối tuần."
              </div>
            </div>

            <div className={styles.promptCard}>
              <h3>Tư vấn triệu chứng</h3>
              <div className={styles.promptExample}>
                "Tôi bị sốt 38.5 độ, đau họng và ho trong 3 ngày, nên khám chuyên khoa nào?"
              </div>
            </div>

            <div className={styles.promptCard}>
              <h3>Hỏi về lịch khám</h3>
              <div className={styles.promptExample}>
                "Cho tôi biết cách hủy lịch khám đã đặt và các điều kiện áp dụng."
              </div>
            </div>
          </div>

          <div className={styles.tipBox}>
            <h4>Mẹo viết Prompt hiệu quả</h4>

            <ul>
              <li>Nêu rõ triệu chứng hoặc nhu cầu khám bệnh.</li>
              <li>Cho biết độ tuổi, giới tính nếu liên quan.</li>
              <li>Ghi rõ khu vực mong muốn khám bệnh.</li>
              <li>Đề cập thời gian mong muốn đặt lịch.</li>
              <li>Viết câu hỏi đầy đủ thay vì chỉ nhập vài từ khóa.</li>
            </ul>
          </div>

          <div className={styles.warningBox}>
            <strong>Lưu ý:</strong> Trợ lý AI chỉ cung cấp thông tin tham khảo,
            không thay thế chẩn đoán hoặc chỉ định điều trị từ bác sĩ chuyên môn.
          </div>
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
      <Footer />
    </>
  );
};

export default BookingGuide;