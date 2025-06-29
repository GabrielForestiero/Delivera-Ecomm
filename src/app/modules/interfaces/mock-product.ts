import { Product } from "./product";

export const MOCK_PRODUCTS: Product[] = [
 {
    id: 1,
    name: 'Coca Cola',
    description: 'Bebida gaseosa clásica',
    price: 150,
    originalStock: 100,
    stock: 80,
    imageUrl: 'https://example.com/coca.jpg',
    category: 'Bebidas',
    createdAt: new Date('2025-01-01')
  },
  {
    id: 2,
    name: 'Pizza Margarita',
    description: 'Pizza con tomate, mozzarella y albahaca',
    price: 800,
    originalStock: 50,
    stock: 20,
    imageUrl: 'https://example.com/pizza.jpg',
    category: 'Pizzas',
    createdAt: new Date('2025-02-15')
  },
  {
    id: 3,
    name: 'Café Espresso',
    description: 'Café fuerte y concentrado',
    price: 200,
    originalStock: 200,
    stock: 150,
    imageUrl: 'https://example.com/cafe.jpg',
    category: 'Café y Té',
    createdAt: new Date('2025-03-10')
  }
];