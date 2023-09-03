import styles from './products.module.scss';
import { useQuery } from '@tanstack/react-query';
import fetcher from '../../utilities/fetcher';
import { Products } from '../../type';
import ProductPreview from '../../components/ProductPreview';
import { useMemo } from 'react';

export const baseUrl = import.meta.env.VITE_APP_API_URL;

const ProductList = () => {
  const { data: products } = useQuery(['products'], () => {
    return fetcher(`${baseUrl}/products.json`, 'GET');
  });

  const productList = useMemo(() => {
    return products?.sort((prev: Products, next: Products) => prev.product_no - next.product_no);
  }, [products]);

  return (
    <section className={styles.container}>
      <div>{productList?.map((item: Products) => <ProductPreview item={item} key={item.product_no} />)}</div>
    </section>
  );
};

export default ProductList;
