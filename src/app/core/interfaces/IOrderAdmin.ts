export interface IOrder {
  orderId: number;
  orderDate: string; // ISO date string
  orderNumber: string;
  orderStatus: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  streetAddress: string;
  appartment: string;
  paymentMethod: string;
  subTotal: number;
  total: number;
  products: IOrderProduct[]; // Array of products
}

export interface IOrderProduct {
  productId: number;
  sizeId: number;
  colorId: number;
  quantity: number;
}
export enum OrderStatus {
  Processing = 2,
  Delivered = 0,
  Cancelled = 1,
}
