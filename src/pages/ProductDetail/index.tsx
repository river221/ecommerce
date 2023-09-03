import styles from './product.module.scss';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import fetcher from '../../utilities/fetcher';
import { baseUrl } from '../ProductList';
import { Products } from '../../type';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const today = new Date().toLocaleDateString().replaceAll('.', '').split(' ');

  const [isSelect, setIsSelect] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleDeliveryTimes = (times: string[]) => {
    if (times.length < 1) return 2;
    const total = times.reduce((acc, cur) => Number(acc) + Number(cur), 0);
    return Math.ceil(total / times.length);
  };

  const handleArrivalDate = (times: string[]) => {
    const today = new Date().getTime();
    const period = handleDeliveryTimes(times);
    const deliveryTime = 1000 * 60 * 60 * 24 * period;
    return new Date(today + deliveryTime).toLocaleDateString();
  };

  const { data: product, isLoading } = useQuery(['product', id], async () => {
    const response = await fetcher(`${baseUrl}/products.json`, 'GET');
    return response.find((item: Products) => item.product_no === Number(id));
  });

  const addCart = () => {
    console.log({
      ...product,
      order: {
        quantity: quantity,
        // price: product.price * quantity,
        date: `${today[0]}-${today[1].padStart(2, '0')}-${today[2].padStart(2, '0')}`,
      },
    });
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
                <i>{handleArrivalDate(product.prev_delivery_times)} 도착 예정</i>
                <br />
                <i>예상 배송일 {handleDeliveryTimes(product.prev_delivery_times)}일</i>
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
                    <button onClick={() => addCart()}>장바구니에 담기</button>
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
