export interface Item {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  cartId?: string; 
  items: Item[];
  createdAt?: Date;
  total?: number;
}