import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './header.module.scss';
import { ReactComponent as UserIcon } from '../../assets/circle-user.svg';
import { ReactComponent as LoginIcon } from '../../assets/sign-in-alt.svg';
import { ReactComponent as LogoutIcon } from '../../assets/sign-out-alt.svg';
import LoginModal from '../LoginModal';
import { useContext, useRef, useState } from 'react';
import { TokenContext } from '../../App';

const menu = [
  { id: 1, path: '/products', name: '상품' },
  { id: 2, path: '/cart', name: '장바구니' },
];

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const token = useContext(TokenContext);

  const clickOutsideModal = (e: any) => {
    if (modalRef.current === e.target) setIsOpenPopup(false);
  };

  return (
    <header className={styles.header}>
      {isOpenPopup && (
        <LoginModal modalRef={modalRef} clickOutsideModal={clickOutsideModal} setIsOpenPopup={setIsOpenPopup} />
      )}
      <h1>
        <Link to="/">ECommerce</Link>
      </h1>
      <nav>
        <ul>
          {menu.map((item) => (
            <li key={item.id} data-nav={pathname === item.path ? 'select' : ''}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
          {!token.user ? (
            <li onClick={() => setIsOpenPopup(true)}>
              <LoginIcon width="16px" height="16px" />
            </li>
          ) : (
            <>
              <li>
                <Link to="../mypage">
                  <UserIcon width="18px" height="18px" />
                </Link>
              </li>
              <li
                onClick={() => {
                  sessionStorage.removeItem('user');
                  token.setUser(null);
                  navigate('/');
                }}>
                <LogoutIcon width="18px" height="18px" />
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
