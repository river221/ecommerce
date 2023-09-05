import { Link } from 'react-router-dom';
import { Products } from '../../type';
import { ReactComponent as AddCartIcon } from '../../assets/shopping-cart-add.svg';
import styles from './productPreview.module.scss';

const ProductPreview = ({ item }: { item: Products }) => {
  const today = new Date().toLocaleDateString().replaceAll('.', '').split(' ');

  const handleCartItems = (product: Products) => {
    const cartItems = localStorage.getItem('cart');
    if (cartItems) {
      const inCartItems = JSON.parse(cartItems);
      const duplicate = inCartItems.find((item: Products) => item.product_no === product.product_no);
      if (duplicate) {
        alert('이미 장바구니에 추가된 상품입니다.');
        return;
      }
      localStorage.setItem('cart', JSON.stringify([...inCartItems, product]));
    } else {
      localStorage.setItem('cart', JSON.stringify([product]));
    }
    if (localStorage.getItem('cart')) alert('장바구니에 추가되었습니다.');
  };

  const addCart = () => {
    const addProduct = {
      ...item,
      order: {
        quantity: 1,
        date: `${today[0]}-${today[1].padStart(2, '0')}-${today[2].padStart(2, '0')}`,
      },
    };
    handleCartItems(addProduct);
  };

  return (
    <div className={styles.product}>
      <Link to={`./${item.product_no}`}>
        <div>
          <img src={item.main_image_url} alt={item.product_no.toString()} />
        </div>
        <p>{item.product_name}</p>
        <p>
          <strong>{item.price.toLocaleString()}</strong>원
        </p>
      </Link>
      <button onClick={() => addCart()}>
        <AddCartIcon width="14px" height="14px" fill="#737373" />
      </button>
    </div>
  );
};

export default ProductPreview;
