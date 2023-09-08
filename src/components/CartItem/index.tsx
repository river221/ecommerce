import { CartProducts } from '../../type';
import styles from './cartItem.module.scss';
import { ReactComponent as DeleteIcon } from '../../assets/cross-circle.svg';
import { Dispatch, SetStateAction } from 'react';

const CartItem = ({
  item,
  products,
  setProducts,
  checklist,
  setChecklist,
}: {
  item: CartProducts;
  products: Map<number, CartProducts>;
  setProducts: Dispatch<SetStateAction<Map<number, CartProducts>>>;
  checklist: number[];
  setChecklist: Dispatch<SetStateAction<number[]>>;
}) => {
  const setCartItems = (productNo: number, quantity: number) => {
    const cartItems = localStorage.getItem('cart');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      const selected = items.findIndex((item: CartProducts) => item.product_no === productNo);
      const updatedItem: CartProducts = {
        ...items[selected],
        order: {
          ...items[selected].order,
          quantity: quantity,
        },
      };
      items.splice(selected, 1, updatedItem);
      localStorage.setItem('cart', JSON.stringify(items));
    }
  };

  const deleteItems = (product: CartProducts) => {
    const cartItems = localStorage.getItem('cart');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      const remaining = items.filter((item: CartProducts) => item.product_no !== product.product_no);
      localStorage.setItem('cart', JSON.stringify(remaining));
      setProducts(
        remaining.reduce(
          (prev: Map<number, CartProducts>, cur: CartProducts) => new Map([...prev, [cur.product_no, { ...cur }]]),
          new Map()
        )
      );
    }
  };

  return (
    <div className={styles.cartItem} key={item.product_no}>
      <div>
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setChecklist((prev) => [...prev, item.product_no]);
            } else {
              setChecklist((prev) => prev.filter((product) => product !== item.product_no));
            }
          }}
          checked={checklist.includes(item.product_no)}
        />
        <span>
          <img src={item.main_image_url} alt={item.product_name} />
          <p>{item.product_name}</p>
        </span>
      </div>
      <div>
        <div>
          <p>{(item.price * item.order.quantity).toLocaleString()}원</p>
          <select
            defaultValue={item.order.quantity}
            onChange={(e) => {
              const quantity = Number(e.target.value);
              setProducts(
                (prev) =>
                  new Map([...prev, [item.product_no, { ...item, order: { ...item.order, quantity: quantity } }]])
              );
              setCartItems(item.product_no, quantity);
            }}>
            {item.maximum_quantity
              ? Array(item.maximum_quantity)
                  .fill(undefined)
                  .map((_, i) => <option key={i + 1}>{i + 1}</option>)
              : Array(100)
                  .fill(undefined)
                  .map((_, i) => <option key={i + 1}>{i + 1}</option>)}
          </select>
        </div>
        {/* <select>
          <option>discount coupon</option>
        </select> */}
        <button onClick={() => deleteItems(item)}>
          <DeleteIcon width="16px" height="16px" fill="#737373" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
