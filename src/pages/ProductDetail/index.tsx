import styles from './product.module.scss';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import fetcher from '../../utilities/fetcher';
import { baseUrl } from '../ProductList';
import { Products } from '../../type';

const ProductDetail = () => {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery(['product', id], async () => {
    const response = await fetcher(`${baseUrl}/products.json`, 'GET');
    return response.find((item: Products) => item.product_no === Number(id));
  });

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
                <i>예상배송일</i>
              </div>
              <div>
                <p>{product.product_name}</p>
                <span>
                  <button>-</button>
                  <input type="number" defaultValue={1} />
                  <button>+</button>
                </span>
              </div>
              <div>
                <button>장바구니에 담기</button>
              </div>
            </div>
          </div>
          <div className={styles.desc}>{product.description}</div>
        </>
      )}
    </section>
  );
};

export default ProductDetail;
