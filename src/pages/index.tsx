import './common.css';
import styles from './home.module.scss';
import MainBanner from '../assets/images/mock_banner_01.jpg';
import SubBanner from '../assets/images/mock_banner_02.jpg';
import EventBanner from '../assets/images/mock_banner_03.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className={styles.container}>
      <div>
        <Link to="../products">
          <p>전 고객 특별 쿠폰 증정</p>
          <img src={MainBanner} alt="banner" />
        </Link>
      </div>
      <div>
        <div>
          <Link to="../products">
            <p>회원 마일리지 증정</p>
            <img src={SubBanner} alt="banner" />
          </Link>
        </div>
        <div>
          <Link to="../products">
            <p>반려동물을 위한 기획전</p>
            <img src={EventBanner} alt="banner" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
