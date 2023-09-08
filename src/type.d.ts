export type Products = {
  product_no: number;
  product_name: string;
  main_image_url: string;
  price: number;
  prev_delivery_times: number[];
  description: string;
  available_coupon?: boolean;
  maximum_quantity?: number;
};

export type CartProducts = Products & {
  order: {
    quantity: number;
    date: string;
  };
};

export interface Coupons {
  type: 'rate' | 'amount' | 'conditional_amount';
  title: string;
  [key: string]: number;
}

export interface RateCoupon extends Coupons {
  discountRate: number;
}

export interface AmountCoupon extends Coupons {
  discountAmount: number;
}

export interface ConditionalCoupon extends Coupons {
  minOrderAmount: number;
  discountAmount: number;
}
