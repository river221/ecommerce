import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.scss';
import { ReactComponent as UserIcon } from '../../assets/circle-user.svg';

const menu = [
  { id: 1, path: '/products', name: '상품' },
  { id: 2, path: '/cart', name: '장바구니' },
];

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
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
          <li>
            <UserIcon width="18px" height="18px" />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
