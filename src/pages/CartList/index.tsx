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
  const [cartCoupon, setCartCoupon] = useState<{ selected: string; coupon: Coupons | undefined }>({
    selected: '',
    coupon: undefined,
  });
  const [realCost, setRealCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [expectedDate, setExpectedDate] = useState('');

  const { user } = useContext(TokenContext);

  const today = new Date().toLocaleDateString().replaceAll('.', '').split(' ');

  const getTotalPrice = (
    products: Map<number, CartProducts>,
    checklist: number[],
    mileage: number,
    coupon: Coupons | undefined
  ) => {
    setTotalPrice(0);
    setRealCost(0);
    const orderProduct = Array.from(products.values()).filter(
      (product: CartProducts) => checklist.includes(product.product_no) && product
    );
    orderProduct.map((item: CartProducts) => setRealCost((prev) => prev + item.price * item.order.quantity));
    orderProduct.map((item: CartProducts) => {
      if (item.order.discount) {
        if (item.order.discount.coupon_type === 'rate') {
          setTotalPrice(
            (prev) =>
              prev + (item.price * item.order.quantity * (100 - Number(item.order.discount?.coupon_payment))) / 100
          );
        }
        if (item.order.discount.coupon_type === 'amount') {
          setTotalPrice(
            (prev) => prev + (item.price * item.order.quantity - Number(item.order.discount?.coupon_payment))
          );
        }
      } else {
        setTotalPrice((prev) => prev + item.price * item.order.quantity);
      }
    });
    setTotalPrice((prev) => prev - mileage);
    coupon && setTotalPrice((prev) => prev - coupon.discountAmount);
  };

  const handleDeliveryInfo = (products: Map<number, CartProducts>, checklist: number[]) => {
    const orderProduct = Array.from(products.values()).filter(
      (product: CartProducts) => checklist.includes(product.product_no) && product
    );
    let expectedDate: number[] = [];
    orderProduct.map((item: CartProducts) => expectedDate.push(item.order.expected_delivery));
    const period = Math.max(...expectedDate);
    const today = new Date().getTime();
    const deliveryTime = 1000 * 60 * 60 * 24 * period;
    setExpectedDate(new Date(today + deliveryTime).toLocaleDateString().replaceAll('. ', '/').replace('.', ''));
  };

  const submitOrder = (products: Map<number, CartProducts>) => {
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
    console.log({
      products: orderProduct,
      mileage_payment: mileage.used,
      date: `${today[0]}-${today[1].padStart(2, '0')}-${today[2].padStart(2, '0')}`,
      real_cost: realCost,
      total_price: totalPrice,
      user: user,
    });
  };

  const validateMileage = (value: number) => {
    if (value < 0) return 0;
    if (value > realCost * 0.05) return realCost * 0.05;
    if (value > mileage.default) return mileage.default;
    return value;
  };

  const handleMileage = (value: string) => {
    if (!/^[0-9 ]*$/.test(value)) return;
    const mileage = validateMileage(Number(value));
    setMileage((prev) => ({ ...prev, used: mileage }));
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

  useEffect(() => {
    getTotalPrice(products, checklist, mileage.used, cartCoupon.coupon);
  }, [products, checklist, coupons, mileage.used, cartCoupon]);

  useEffect(() => {
    handleDeliveryInfo(products, checklist);
  }, [products, checklist]);

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
            setCartCoupon({ selected: '', coupon: undefined });
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
              setMileage={setMileage}
              setCartCoupon={setCartCoupon}
            />
          ))}
      </div>
      <div className={styles.orderInfo}>
        {user && (
          <>
            <div>
              <h5>마일리지</h5>
              <p className={styles.desc}>
                쿠폰 적용 이전가의 5% 까지 적용 가능 {realCost > 0 && <b> → {(realCost * 0.05).toLocaleString()}점</b>}
              </p>
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
              <select
                value={cartCoupon.selected}
                onChange={(e) => {
                  setCartCoupon({
                    selected: e.target.value,
                    coupon: coupons.find((item) => item.title === e.target.value),
                  });
                }}>
                <option value={''}>적용 가능한 쿠폰을 선택해주세요.</option>
                {coupons.map(
                  (item) =>
                    item.type === 'conditional_amount' &&
                    totalPrice > item.minOrderAmount && (
                      <option key={item.title} value={item.title}>
                        {item.title}
                      </option>
                    )
                )}
              </select>
            </div>
          </>
        )}
        <div>
          <h5>합계</h5>
          {realCost > totalPrice && (
            <p style={{ textDecoration: 'line-through', color: '#737373', fontWeight: '300' }}>
              {realCost.toLocaleString()}
            </p>
          )}
          <b>{totalPrice.toLocaleString()}원</b>
          {checklist.length > 0 && <p className={styles.desc}>주문 상품 {expectedDate} 이내 도착 예정</p>}
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
