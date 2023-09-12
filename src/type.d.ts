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

export type Discount = {
  coupon_type: CouponType;
  coupon_payment: number;
  // mileage?: number;
  // price: number;
};

type OrderOption = {
  quantity: number;
  date: string;
  expected_delivery: number;
  discount?: Discount;
};

export type CartProducts = Products & {
  order: OrderOption;
};

export type CouponType = 'rate' | 'amount' | 'conditional_amount';

export interface Coupons {
  type: CouponType;
  title: string;
  isSelect?: boolean;
  [key: string]: any;
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
