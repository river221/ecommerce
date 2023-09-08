import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartList from './pages/CartList';
import MyPage from './pages/MyPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/products', element: <ProductList /> },
      { path: '/products/:id', element: <ProductDetail /> },
      { path: '/cart', element: <CartList /> },
      { path: '/mypage', element: <MyPage /> },
    ],
  },
]);

export default router;
