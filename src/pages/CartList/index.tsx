import styles from './cart.module.scss';
import { useEffect, useState } from 'react';
import { CartProducts } from '../../type';
import CartItem from '../../components/CartItem';

const CartList = () => {
  const [checklist, setChecklist] = useState<number[]>([]);
  const [products, setProducts] = useState(new Map());
  // const [orders, setOrders] = useState<CartProducts[]>([]);
  // console.log(checklist);

  const today = new Date().toLocaleDateString().replaceAll('.', '').split(' ');

  const getCartItems = () => {
    const cartItems = localStorage.getItem('cart');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      setProducts(
        items.reduce(
          (prev: Map<number, CartProducts>, cur: CartProducts) => new Map([...prev, [cur.product_no, { ...cur }]]),
          new Map()
        )
      );
      setChecklist([...new Set([...items.map((item: CartProducts) => item.product_no)])]);
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
              setChecklist([...Array.from(products.keys())]);
            } else {
              setChecklist([]);
            }
          }}
          checked={checklist.length === products.size && products.size > 0}
        />
        <p>전체 선택 / 해제</p>
      </label>
      <div>
        {products.size > 0 &&
          Array.from(products.values()).map((item) => (
            <CartItem
              key={item.product_no}
              item={item}
              products={products}
              setProducts={setProducts}
              checklist={checklist}
              setChecklist={setChecklist}
            />
          ))}
      </div>
      <div>
        <b>total price</b>
      </div>
      <div>
        <button
          onClick={() =>
            console.log(
              Array.from(products.values()).map(
                (product: CartProducts) => checklist.includes(product.product_no) && product
              )
            )
          }>
          주문하기
        </button>
      </div>
    </section>
  );
};

export default CartList;
