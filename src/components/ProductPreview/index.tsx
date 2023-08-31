import { Link } from 'react-router-dom';
import { Products } from '../../type';
import { ReactComponent as AddCartIcon } from '../../assets/shopping-cart-add.svg';
import styles from './productPreview.module.scss';

const ProductPreview = ({ item }: { item: Products }) => {
  return (
    <div className={styles.product}>
      <Link to={`./${item.product_no}`}>
        <div>
          <img src={item.main_image_url} alt={item.product_no.toString()} />
        </div>
        <p>{item.product_name}</p>
        <p>
          <strong>{item.price.toLocaleString()}</strong>원
        </p>
      </Link>
      <button onClick={() => console.log(item)}>
        <AddCartIcon width="14px" height="14px" fill="#737373" />
      </button>
    </div>
  );
};

export default ProductPreview;
