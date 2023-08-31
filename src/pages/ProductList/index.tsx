import styles from './products.module.scss';
import { ReactComponent as AddCartIcon } from '../../assets/shopping-cart-add.svg';
import { useQuery } from '@tanstack/react-query';
import fetcher from '../../utilities/fetcher';
import { Products } from '../../type';
import { Link } from 'react-router-dom';
import ProductPreview from '../../components/ProductPreview';

export const baseUrl = import.meta.env.VITE_APP_API_URL;

const ProductList = () => {
  const { data: products } = useQuery(['products'], () => {
    return fetcher(`${baseUrl}/products.json`, 'GET');
  });

  return (
    <section className={styles.container}>
      <div>{products?.map((item: Products) => <ProductPreview item={item} key={item.product_no} />)}</div>
    </section>
  );
};

export default ProductList;
