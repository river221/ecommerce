import styles from './products.module.scss';
import { useQuery } from '@tanstack/react-query';
import fetcher from '../../utilities/fetcher';
import { Products } from '../../type';
import ProductPreview from '../../components/ProductPreview';
import { useMemo, useState } from 'react';
import Pagination from '../../components/Pagination';

export const baseUrl = import.meta.env.VITE_APP_API_URL;

const ProductList = () => {
  let limit = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageBlock, setCurrentPageBlock] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [firstCount, setFirstCount] = useState(0);

  const { data: products } = useQuery(['products'], async () => {
    const response = await fetcher(`${baseUrl}/products.json`, 'GET');
    if (response) setTotalPage(Math.ceil(response.length / limit));
    return response;
  });

  const productList = useMemo(() => {
    return products
      ?.sort((prev: Products, next: Products) => prev.product_no - next.product_no)
      .slice(firstCount, firstCount + limit);
  }, [products, firstCount]);

  return (
    <section className={styles.container}>
      <div>{productList?.map((item: Products) => <ProductPreview item={item} key={item.product_no} />)}</div>
      <Pagination
        limit={limit}
        totalPage={totalPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentPageBlock={currentPageBlock}
        setCurrentPageBlock={setCurrentPageBlock}
        firstCount={firstCount}
        setFirstCount={setFirstCount}
      />
    </section>
  );
};

export default ProductList;
