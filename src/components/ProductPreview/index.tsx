import { Link } from 'react-router-dom';
import { Products } from '../../type';
import { ReactComponent as AddCartIcon } from '../../assets/shopping-cart-add.svg';
import styles from './productPreview.module.scss';
import { calcExpectedDeliveryTimes } from '../../utilities/calculate';
import { persist } from '../../utilities/persist';

const ProductPreview = ({ item }: { item: Products }) => {
  const today = new Date().toLocaleDateString().replaceAll('.', '').split(' ');

  const addCart = (product: Products) => {
    const cartItems = persist.getLocalStorage('cart');
    if (cartItems) {
      const duplicate = cartItems.find((item: Products) => item.product_no === product.product_no);
      if (duplicate) {
        alert('이미 장바구니에 추가된 상품입니다.');
        return;
      }
      persist.setLocalStorage('cart', [...cartItems, product]);
    } else {
      persist.setLocalStorage('cart', [product]);
    }
    if (persist.getLocalStorage('cart')) alert('장바구니에 추가되었습니다.');
  };

  const handleCartItems = () => {
    const addProduct = {
      ...item,
      order: {
        quantity: 1,
        date: `${today[0]}-${today[1].padStart(2, '0')}-${today[2].padStart(2, '0')}`,
        expected_delivery: calcExpectedDeliveryTimes(item.prev_delivery_times),
      },
    };
    addCart(addProduct);
  };

  return (
    <div className={styles.product}>
      <Link to={`./${item.product_no}`}>
        <div>
          <img src={item.main_image_url} alt={item.product_no.toString()} width={240} height={240} />
        </div>
        <p>{item.product_name}</p>
        <p>
          <strong>{item.price.toLocaleString()}</strong>원
        </p>
      </Link>
      <button onClick={() => handleCartItems()}>
        <AddCartIcon width="14px" height="14px" fill="#737373" />
      </button>
    </div>
  );
};

export default ProductPreview;
