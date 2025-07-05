
export interface Product {
  _id: string; 
  name: string;
  description?: string;
  price: number;
  originalStock?: number;
  stock?: number;
  imageUrl?: string;
  category: string;
  createdAt?: Date;
}
