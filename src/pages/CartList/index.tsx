import styles from './cart.module.scss';
import { useContext, useEffect, useState } from 'react';
import { CartProducts, Coupons } from '../../type';
import CartItem from '../../components/CartItem';
import { TokenContext } from '../../App';
import { useQuery } from '@tanstack/react-query';
import fetcher from '../../utilities/fetcher';
import { baseUrl } from '../ProductList';

const CartList = () => {
  const [checklist, setChecklist] = useState<number[]>([]);
  const [products, setProducts] = useState(new Map());
  const [coupons, setCoupons] = useState<Coupons[]>([]);
  const [mileage, setMileage] = useState({ default: 0, used: 0 });
  // const [orders, setOrders] = useState({
  //   products: [],
  //   mileage_payment: 0,
  //   date: '',
  //   total_price: 0,
  //   user: '',
  // });
  // console.log(checklist);
  const { user } = useContext(TokenContext);

  const today = new Date().toLocaleDateString().replaceAll('.', '').split(' ');

  const submitOrder = (products: Map<number, CartProducts>) => {
    // const orderProduct = Array.from(products.values()).filter(
    //   (product: CartProducts) => checklist.includes(product.product_no) && product
    // );
    // setOrders((prev) => ({
    //   ...prev,
    //   mileage_payment: mileage.used,
    //   date: `${today[0]}-${today[1].padStart(2, '0')}-${today[2].padStart(2, '0')}`,
    //   total_price: 0,
    //   user: user ?? '',
    // }));
    const orderProduct = Array.from(products.values()).reduce((acc: any, cur: CartProducts) => {
      return (
        checklist.includes(cur.product_no) && [
          ...acc,
          {
            product_no: cur.product_no,
            product_name: cur.product_name,
            price: cur.price,
            order: {
              quantity: cur.order.quantity,
              expected_delivery: cur.order.expected_delivery,
              discount: { ...cur.order.discount },
            },
          },
        ]
      );
    }, []);
    console.log(orderProduct);
  };

  const validateMileage = (value: number) => {
    if (value < 0) return 0;
    if (value > mileage.default) return mileage.default;
    return value;
  };

  const handleMileage = (value: string) => {
    if (!/^[0-9 ]*$/.test(value)) return;
    setMileage((prev) => ({ ...prev, used: validateMileage(Number(value)) }));
  };

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

  const { data: couponList } = useQuery(
    ['coupons', user],
    async () => {
      const response = await fetcher(`${baseUrl}/coupons.json`, 'GET');
      if (response) setCoupons(response);
      return response;
    },
    { enabled: !!user, cacheTime: 0 }
  );

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    if (user) setMileage((prev) => ({ ...prev, default: 30000 }));
  }, [user]);

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
              coupons={coupons}
              setCoupons={setCoupons}
            />
          ))}
      </div>
      <div className={styles.orderInfo}>
        {user && (
          <>
            <div>
              <h5>마일리지</h5>
              <span>
                <p>현재: 30,000</p>
                <input type="text" value={mileage.used} onChange={(e) => handleMileage(e.target.value)} />
                <p>
                  잔액: <strong>{(mileage.default - mileage.used).toLocaleString()}</strong>점
                </p>
              </span>
            </div>
            <div>
              <h5>쿠폰</h5>
              <select defaultValue={''}>
                <option value={''}>적용 가능한 쿠폰을 선택해주세요.</option>
                {coupons.map(
                  (item) => item.type === 'conditional_amount' && <option key={item.title}>{item.title}</option>
                )}
              </select>
            </div>
          </>
        )}
        <div>
          <h5>합계</h5>
          <b>total price</b>
          <p>delivery info</p>
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            submitOrder(products);
            // console.log(
            //   Array.from(products.values()).map(
            //     (product: CartProducts) => checklist.includes(product.product_no) && product
            //   )
            // );
            // console.log(coupons);
          }}>
          주문하기
        </button>
      </div>
    </section>
  );
};

export default CartList;
