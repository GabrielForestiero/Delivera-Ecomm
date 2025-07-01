
export type Category =
  | 'Bebidas'
  | 'Comidas'
  | 'Postres'
  | 'Snacks'
  | 'Cerveza'
  | 'Vino'
  | 'Tragos'
  | 'Sin alcohol'
  | 'Promoción'
  | 'Happy Hour'
  | 'Vegano'
  | 'Apto Celíacos'
  | 'Café y Té'
  | 'Entradas'
  | 'Hamburguesas'
  | 'Pizzas'
  | 'Pastas'
  | 'Sushi'
  | 'Otros';

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
