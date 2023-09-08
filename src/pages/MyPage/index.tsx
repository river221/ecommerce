import { useContext } from 'react';
import styles from './mypage.module.scss';
import { TokenContext } from '../../App';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import fetcher from '../../utilities/fetcher';
import { baseUrl } from '../ProductList';
import { Coupons } from '../../type';

const MyPage = () => {
  const token = useContext(TokenContext);

  const { data: coupons } = useQuery(
    ['coupons'],
    () => {
      return fetcher(`${baseUrl}/coupons.json`, 'GET');
    },
    { enabled: token.user ? true : false }
  );

  if (!token.user) return <Navigate to="/" replace={true} />;
  return (
    <section className={styles.container}>
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
