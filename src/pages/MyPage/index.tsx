import { useContext } from 'react';
import styles from './mypage.module.scss';
import { AuthContext } from '../../App';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import fetcher from '../../utilities/fetcher';
import { baseUrl } from '../ProductList';
import { Coupons } from '../../type';

const MyPage = () => {
  const auth = useContext(AuthContext);

  const { data: coupons } = useQuery(
    ['coupons'],
    () => {
      return fetcher(`${baseUrl}/coupons.json`, 'GET');
    },
    { enabled: auth.user ? true : false }
  );

  if (!auth.user) return <Navigate to="/" replace={true} />;
  return (
    <section className={styles.container}>
      <h4>
        안녕하세요. <strong>{auth.user}</strong> 님 🙂
      </h4>
      <h2>마이페이지</h2>
      <div className={styles.wrapper}>
        <div>
          <h3>쿠폰</h3>
          <div>
            <ul>{coupons?.map((coupon: Coupons) => <li key={coupon.title}>{coupon.title}</li>)}</ul>
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
