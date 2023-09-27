import styles from './product.module.scss';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import fetcher from '../../utilities/fetcher';
import { baseUrl } from '../ProductList';
import { Products } from '../../type';
import { useState } from 'react';
import { calcArrivalDate, calcExpectedDeliveryTimes } from '../../utilities/calculate';
import { persist } from '../../utilities/persist';

const ProductDetail = () => {
  const { id } = useParams();
  const today = new Date().toLocaleDateString().replaceAll('.', '').split(' ');

  const [isSelect, setIsSelect] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery(['product', id], async () => {
    const response = await fetcher(`${baseUrl}/products.json`, 'GET');
    return response.find((item: Products) => item.product_no === Number(id));
  });

  const addCart = (product: Products) => {
    const cartItems = persist.getLocalStorage('cart');
    if (cartItems) {
      if (cartItems.length >= 10) {
        alert('최대 10개의 상품을 장바구니에 담을 수 있습니다.');
        return;
      }
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
      ...product,
      order: {
        quantity: quantity,
        expected_delivery: calcExpectedDeliveryTimes(product.prev_delivery_times),
        date: `${today[0]}-${today[1].padStart(2, '0')}-${today[2].padStart(2, '0')}`,
      },
    };
    addCart(addProduct);
  };

  return (
    <section>
      {!isLoading && (
        <>
          <div className={styles.product}>
            <div className={styles.image}>
              <img src={product.main_image_url} alt={product.product_name} />
            </div>
            <div className={styles.info}>
              <div>
                <h4>{product.product_name}</h4>
                <p>{product.price.toLocaleString()}원</p>
                <i>{calcArrivalDate(product.prev_delivery_times)} 도착 예정</i>
                <br />
                <i>예상 배송기간 {calcExpectedDeliveryTimes(product.prev_delivery_times)}일</i>
                <button onClick={() => setIsSelect(true)}>구매하기</button>
              </div>
              {isSelect && (
                <div className={styles.order}>
                  <div>
                    <p>{product.product_name}</p>
                    <span>
                      <select onChange={(e) => setQuantity(Number(e.target.value))}>
                        {product.maximum_quantity
                          ? Array(product.maximum_quantity)
                              .fill(undefined)
                              .map((_, i) => <option key={i + 1}>{i + 1}</option>)
                          : Array(100)
                              .fill(undefined)
                              .map((_, i) => <option key={i + 1}>{i + 1}</option>)}
                      </select>
                    </span>
                  </div>
                  <hr />
                  <p>{(product.price * quantity).toLocaleString()} 원</p>
                  <div>
                    <button onClick={() => handleCartItems()}>장바구니에 담기</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.desc}>{product.description}</div>
        </>
      )}
    </section>
  );
};

export default ProductDetail;
