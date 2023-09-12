import { Dispatch, SetStateAction, useState } from 'react';
import { CartProducts, CouponType, Coupons } from '../../type';
import styles from './couponOption.module.scss';

const CouponOption = ({
  coupons,
  setCoupons,
  item,
  setProducts,
}: {
  coupons: Coupons[];
  setCoupons: Dispatch<SetStateAction<Coupons[]>>;
  item: CartProducts;
  setProducts: Dispatch<SetStateAction<Map<number, CartProducts>>>;
}) => {
  const [hasOption, setHasOption] = useState(false);
  // console.log(coupons);

  const resetOption = (item: CartProducts) => {
    setHasOption(false);
    if (item.order.discount && item.order.discount.coupon_payment > 0) {
      setProducts(
        (prev) =>
          new Map([
            ...prev,
            [
              item.product_no,
              {
                ...item,
                order: {
                  date: item.order.date,
                  quantity: item.order.quantity,
                  expected_delivery: item.order.expected_delivery,
                },
              },
            ],
          ])
      );
      setCoupons((coupons) =>
        coupons.reduce((acc, cur) => {
          const temp = acc.find((item) => item.title === cur.title);
          if (!temp) {
            if (cur.type === item.order.discount?.coupon_type) return [...acc, { ...cur, isSelect: false }];
            return [...acc, { ...cur }];
          } else {
            if (cur.type === item.order.discount?.coupon_type) return [{ ...cur, isSelect: false }];
            return [{ ...cur }];
          }
        }, coupons)
      );
    }
  };

  const handleCoupon = (type: CouponType, discountOption: number, item: CartProducts) => {
    // console.log(`${type} - ${discountOption}`);
    // console.log(item.product_name);
    setProducts(
      (prev) =>
        new Map([
          ...prev,
          [
            item.product_no,
            { ...item, order: { ...item.order, discount: { coupon_type: type, coupon_payment: discountOption } } },
          ],
        ])
    );
    setCoupons((coupons) =>
      coupons.reduce((acc, cur) => {
        const temp = acc.find((item) => item.title === cur.title);
        if (!temp) {
          if (cur.type === type) return [...acc, { ...cur, isSelect: true }];
          return [...acc, { ...cur }];
        } else {
          if (cur.type === type) return [{ ...cur, isSelect: true }];
          return [{ ...cur }];
        }
      }, coupons)
    );
  };

  return (
    <div className={styles.container}>
      {!hasOption ? (
        <>
          {coupons.length > 0 && item.available_coupon === undefined ? (
            <button className={styles.couponButton} onClick={() => setHasOption(true)}>
              쿠폰 적용하기
            </button>
          ) : (
            coupons.length > 0 &&
            item.available_coupon === false && <p style={{ fontSize: '12px', color: '#d4d4d4' }}>쿠폰 적용 불가 상품</p>
          )}
        </>
      ) : (
        <div className={styles.option}>
          {coupons &&
            coupons.map(
              (coupon: Coupons) =>
                coupon.type !== 'conditional_amount' && (
                  <label key={coupon.title}>
                    <input
                      type="radio"
                      name={item.product_name}
                      value={coupon.type}
                      onChange={(e) => {
                        const type = e.target.value;
                        type === 'rate' && handleCoupon(type, coupon.discountRate, item);
                        type === 'amount' && handleCoupon(type, coupon.discountAmount, item);
                      }}
                      disabled={item.order.discount || coupon.isSelect === true ? true : false}
                    />
                    <span>{coupon.title}</span>
                  </label>
                )
            )}
          <button onClick={() => resetOption(item)}>선택 해제</button>
        </div>
      )}
    </div>
  );
};

export default CouponOption;
