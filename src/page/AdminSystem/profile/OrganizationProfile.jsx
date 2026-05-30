import React from "react";
import styles from "./OrganizationProfile.module.css";
import sampleOrg from "../../../data/AdminSystem";

const OrganizationProfile = ({ org = sampleOrg }) => {
  const firstLetter = org.name ? org.name.trim().charAt(0).toUpperCase() : "O";

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.brand}>
          {org.logoUrl ? (
            <img className={styles.logo} src={org.logoUrl} alt={org.name} />
          ) : (
            <div className={styles.logoFallback}>{firstLetter}</div>
          )}
          <div>
            <h1 className={styles.name}>{org.name}</h1>
            <p className={styles.tagline}>{org.tagline}</p>
          </div>
        </div>

        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Năm thành lập</div>
            <div className={styles.kpiValue}>{org.founded}</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Quy mô</div>
            <div className={styles.kpiValue}>{org.teamSize}+ người</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Trụ sở chính</div>
            <div className={styles.kpiValue}>{org.hq?.address}</div>
          </div>
        </div>
      </section>

      <section className={styles.gridTwo}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Sứ mệnh</h2>
          <p className={styles.text}>{org.mission}</p>
        </div>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Tầm nhìn</h2>
          <p className={styles.text}>{org.vision}</p>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Giá trị cốt lõi</h2>
        <ul className={styles.chips}>
          {org.values?.map((v) => (
            <li key={v} className={styles.chip}>
              {v}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Sản phẩm / Dịch vụ</h2>
        <div className={styles.products}>
          {org.products?.map((p) => (
            <div key={p.name} className={styles.product}>
              <div className={styles.productIcon}>💡</div>
              <div>
                <div className={styles.productName}>{p.name}</div>
                <div className={styles.productDesc}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gridTwo}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Pháp lý</h2>
          <div className={styles.meta}>
            <div>
              <span className={styles.metaLabel}>Tên pháp lý:</span>{" "}
              <span className={styles.metaValue}>{org.legalName}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>Mã ĐKKD:</span>{" "}
              <span className={styles.metaValue}>{org.regNumber}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>Mã số thuế:</span>{" "}
              <span className={styles.metaValue}>{org.taxNumber}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>Trụ sở:</span>{" "}
              <span className={styles.metaValue}>
                {org.hq?.address} – {org.hq?.country}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Tuân thủ & Bảo mật</h2>
          <ul className={styles.bullets}>
            {org.compliance?.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.gridTwo}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Cột mốc</h2>
          <ul className={styles.timeline}>
            {org.milestones?.map((m, idx) => (
              <li key={idx} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{m.year}</div>
                <div>
                  <div className={styles.timelineTitle}>{m.title}</div>
                  <div className={styles.timelineNote}>{m.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Giải thưởng</h2>
          <ul className={styles.bullets}>
            {org.awards?.map((a) => (
              <li key={a}> {a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Văn phòng</h2>
        <div className={styles.offices}>
          {org.offices?.map((o) => (
            <div key={o.city} className={styles.office}>
              <div className={styles.officeCity}>{o.city}</div>
              <div className={styles.officeAddr}>{o.address}</div>
              <div className={styles.officePhone}>{o.phone}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gridTwo}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Liên hệ</h2>
          <div className={styles.contacts}>
            <div>
              <span className={styles.metaLabel}>Hotline:</span>{" "}
              <span className={styles.metaValue}>{org.contacts?.hotline}</span>
            </div>
            <div>
              <span className={styles.metaLabel}>Email:</span>{" "}
              <a href={`mailto:${org.contacts?.email}`} className={styles.link}>
                {org.contacts?.email}
              </a>
            </div>
            <div>
              <span className={styles.metaLabel}>Website:</span>{" "}
              <a href={org.contacts?.website} className={styles.link}>
                {org.contacts?.website}
              </a>
            </div>
            <div>
              <span className={styles.metaLabel}>Giờ hỗ trợ:</span>{" "}
              <span className={styles.metaValue}>
                {org.contacts?.supportHours}
              </span>
            </div>
            <div>
              <span className={styles.metaLabel}>Đ/c nhận thư:</span>{" "}
              <span className={styles.metaValue}>
                {org.contacts?.addressForMail}
              </span>
            </div>
          </div>
          <div className={styles.socials}>
            <a href={org.social?.facebook} className={styles.socialBtn}>
              Facebook
            </a>
            <a href={org.social?.linkedin} className={styles.socialBtn}>
              LinkedIn
            </a>
            <a href={org.social?.youtube} className={styles.socialBtn}>
              YouTube
            </a>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Tài liệu & Liên kết</h2>
          <div className={styles.linksList}>
            <a href={org.policies?.terms} className={styles.linkRow}>
              <span>Điều khoản sử dụng</span> <span>→</span>
            </a>
            <a href={org.policies?.privacy} className={styles.linkRow}>
              <span>Chính sách bảo mật</span> <span>→</span>
            </a>
            <a href={org.policies?.sla} className={styles.linkRow}>
              <span>Cam kết dịch vụ (SLA)</span> <span>→</span>
            </a>
            <a href={org.policies?.pressKit} className={styles.linkRow}>
              <span>Press Kit / Bộ nhận diện</span> <span>→</span>
            </a>
            <a href={org.policies?.hiring} className={styles.linkRow}>
              <span>Tuyển dụng</span> <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrganizationProfile;
