import styles from './cart.module.scss';
import { ReactComponent as DeleteIcon } from '../../assets/cross-circle.svg';

const Cart = () => {
  return (
    <section className={styles.container}>
      <h2>장바구니</h2>
      <div>
        <div className={styles.cartItem}>
          <div>
            <input type="checkbox" />
            <span>
              {/* <img src={product.main_image_url} alt={product.product_name} /> */}
              <p>product name</p>
            </span>
          </div>
          <div>
            <div>
              <p>price원</p>
              <input type="number" defaultValue={1} />
            </div>
            <button>
              <DeleteIcon width="20px" height="20px" fill="#737373" />
            </button>
          </div>
        </div>
      </div>
      <div>
        <b>total price</b>
      </div>
      <div>
        <button>주문하기</button>
      </div>
    </section>
  );
};

export default Cart;
