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
