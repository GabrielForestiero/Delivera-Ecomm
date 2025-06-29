import { Product } from "./product";

export interface Item {
  productId: number; 
  quantity: number;
  product?: Product; 
}

export interface Cart {
  id?: string; 
  items: Item[];
  createdAt?: Date;
  total?: number;
}