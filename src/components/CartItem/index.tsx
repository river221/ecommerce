import { CartProducts, Coupons, Discount } from '../../type';
import styles from './cartItem.module.scss';
import { ReactComponent as DeleteIcon } from '../../assets/cross-circle.svg';
import { Dispatch, SetStateAction, useContext } from 'react';
import CouponOption from '../CouponOption';
import { AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { persist } from '../../utilities/persist';

const CartItem = ({
  item,
  products,
  setProducts,
  checklist,
  setChecklist,
  coupons,
  setCoupons,
  setMileage,
  setCartCoupon,
}: {
  item: CartProducts;
  products: Map<number, CartProducts>;
  setProducts: Dispatch<SetStateAction<Map<number, CartProducts>>>;
  checklist: number[];
  setChecklist: Dispatch<SetStateAction<number[]>>;
  coupons: Coupons[];
  setCoupons: Dispatch<SetStateAction<Coupons[]>>;
  setMileage: Dispatch<SetStateAction<{ default: number; used: number }>>;
  setCartCoupon: Dispatch<SetStateAction<{ selected: string; coupon: Coupons | undefined }>>;
}) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const setCartItems = (productNo: number, quantity: number) => {
    const cartItems = persist.getLocalStorage('cart');
    if (cartItems) {
      const selected = cartItems.findIndex((item: CartProducts) => item.product_no === productNo);
      const updatedItem: CartProducts = {
        ...cartItems[selected],
        order: {
          ...cartItems[selected].order,
          quantity: quantity,
        },
      };
      cartItems.splice(selected, 1, updatedItem);
      persist.setLocalStorage('cart', cartItems);
    }
    setMileage((prev) => ({ ...prev, used: 0 }));
    setCartCoupon({ selected: '', coupon: undefined });
  };

  const deleteItems = (product: CartProducts) => {
    const cartItems = persist.getLocalStorage('cart');
    if (cartItems) {
      const remaining = cartItems.filter((item: CartProducts) => item.product_no !== product.product_no);
      persist.setLocalStorage('cart', remaining);
      setProducts((products) =>
        Array.from(products.values())
          .filter((item: CartProducts) => item.product_no !== product.product_no)
          .reduce(
            (prev: Map<number, CartProducts>, cur: CartProducts) => new Map([...prev, [cur.product_no, { ...cur }]]),
            new Map()
          )
      );
    }
    setCoupons((coupons) =>
      coupons.reduce((acc, cur) => {
        const temp = acc.find((item) => item.title === cur.title);
        if (!temp) {
          if (cur.type === product.order.discount?.coupon_type) return [...acc, { ...cur, isSelect: false }];
          return [...acc, { ...cur }];
        } else {
          if (cur.type === product.order.discount?.coupon_type) return [{ ...cur, isSelect: false }];
          return [{ ...cur }];
        }
      }, coupons)
    );
    setMileage((prev) => ({ ...prev, used: 0 }));
    setCartCoupon({ selected: '', coupon: undefined });
  };

  const handleExpectedDate = (period: number) => {
    const today = new Date().getTime();
    const deliveryTime = 1000 * 60 * 60 * 24 * period;
    return new Date(today + deliveryTime).toLocaleDateString();
  };

  const getDiscount = (price: number, quantity: number, discount: Discount) => {
    if (discount.coupon_type === 'rate') {
      return (price * quantity * ((100 - discount.coupon_payment) / 100)).toLocaleString();
    }
    if (discount.coupon_type === 'amount') {
      return (price * quantity - discount.coupon_payment).toLocaleString();
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
            setMileage((prev) => ({ ...prev, used: 0 }));
            setCartCoupon({ selected: '', coupon: undefined });
          }}
          checked={checklist.includes(item.product_no)}
        />
        <span onClick={() => navigate(`../products/${item.product_no}`)}>
          <img src={item.main_image_url} alt={item.product_name} />
          <p>{item.product_name}</p>
        </span>
      </div>
      <div>
        <div className={styles.orderInfo}>
          <p className={item.order.discount ? `${styles.cancel}` : ''}>
            {(item.price * item.order.quantity).toLocaleString()}원
          </p>
          {item.order.discount && <p>{getDiscount(item.price, item.order.quantity, item.order.discount)}원</p>}
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
          <p className={styles.desc}>
            {handleExpectedDate(item.order.expected_delivery)}
            <br />
            도착 예정
          </p>
        </div>
        {auth.user && <CouponOption coupons={coupons} setCoupons={setCoupons} item={item} setProducts={setProducts} />}
        <button onClick={() => deleteItems(item)}>
          <DeleteIcon width="16px" height="16px" fill="#737373" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
