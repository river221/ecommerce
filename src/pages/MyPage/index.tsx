import styles from './mypage.module.scss';

const MyPage = () => {
  return (
    <section className={styles.container}>
      <h2>마이페이지</h2>
      <div className={styles.wrapper}>
        <div>
          <h3>쿠폰</h3>
          <div>
            <ul>
              <li>20% 할인 쿠폰</li>
              <li>20% 할인 쿠폰</li>
            </ul>
          </div>
        </div>
        <div>
          <h3>마일리지</h3>
          <div>
            <p>
              <strong>30,000</strong> point
            </p>
          </div>
        </div>
      </div>
      <div className={styles.order}>
        <h3>구매내역</h3>
      </div>
    </section>
  );
};

export default MyPage;
