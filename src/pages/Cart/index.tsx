import styles from './cart.module.scss';
import { ReactComponent as DeleteIcon } from '../../assets/cross-circle.svg';
import { useEffect, useState } from 'react';
import { Products } from '../../type';

const Cart = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [checklist, setChecklist] = useState<Products[]>([]);

  const deleteItems = (product: Products) => {
    const cartItems = localStorage.getItem('cart');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      const remaining = items.filter((item: Products) => item.product_no !== product.product_no);
      localStorage.setItem('cart', JSON.stringify(remaining));
      setProducts(remaining);
    }
  };

  const getCartItems = () => {
    const cartItems = localStorage.getItem('cart');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      setProducts(items);
      setChecklist(items);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <section className={styles.container}>
      <h2>장바구니</h2>
      <label>
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setChecklist([...products]);
            } else {
              setChecklist([]);
            }
          }}
          checked={checklist.length === products.length && products.length > 0 ? true : false}
        />
        <p>전체 선택 / 해제</p>
      </label>
      <div>
        {products.length > 0 &&
          products.map((item) => (
            <div className={styles.cartItem} key={item.product_no}>
              <div>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setChecklist((prev) => [...prev, item]);
                    } else {
                      setChecklist((prev) => prev.filter((product) => product.product_no !== item.product_no));
                    }
                  }}
                  checked={checklist.includes(item) ? true : false}
                />
                <span>
                  <img src={item.main_image_url} alt={item.product_name} />
                  <p>{item.product_name}</p>
                </span>
              </div>
              <div>
                <div>
                  <p>{(item.price * item.order!.quantity).toLocaleString()}원</p>
                  <input type="number" defaultValue={item.order?.quantity} />
                </div>
                {/* <select>
                  <option>discount coupon</option>
                </select> */}
                <button onClick={() => deleteItems(item)}>
                  <DeleteIcon width="16px" height="16px" fill="#737373" />
                </button>
              </div>
            </div>
          ))}
      </div>
      <div>
        <b>total price</b>
      </div>
      <div>
        <button>주문하기</button>
      </div>
    </section>
  );
};

export default Cart;
