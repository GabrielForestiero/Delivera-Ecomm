import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Cart, Item } from '../../modules/interfaces/cart';
import { AuthService } from '../auth/auth.service';

export interface Order {
  _id: any;
  status: string;
  total: number
  paymentMethod: 'card' | 'transfer';
  cardData?: {
    cardNumber: string;
    cardCvv: string;
    cardValidThru: string;
    cardHolder: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  private orderUrl = 'http://localhost:3000/api/order';

  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 });
  cart$ = this.cartSubject.asObservable();

  private cartOpenSubject = new BehaviorSubject<boolean>(false);
  cartOpen$ = this.cartOpenSubject.asObservable();

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }

  getCartValue(): Cart {
    return this.cartSubject.getValue();
  }

  openCart() {
    this.cartOpenSubject.next(true);
  }

  closeCart() {
    this.cartOpenSubject.next(false);
  }

  toggleCart() {
    this.cartOpenSubject.next(!this.cartOpenSubject.value);
  }

  getCart(): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get<Cart>(this.apiUrl, { headers }).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: (err) => console.error('Error cargando carrito', err)
    });
  }

  addProduct(productId: string, quantity: number = 1): void {
    const headers = this.authService.getAuthHeaders();
    this.http.post<Cart>(this.apiUrl, { productId, quantity, action: 'add' }, { headers }).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: (err) => console.error('Error agregando producto', err)
    });
  }

  removeProduct(productId: string, quantity: number = 1): void {
    const headers = this.authService.getAuthHeaders();
    this.http.post<Cart>(this.apiUrl, { productId, quantity, action: 'remove' }, { headers }).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: (err) => console.error('Error removiendo producto', err)
    });
  }

  createOrder(paymentMethod: 'card' | 'transfer', cardData?: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    const currentCart = this.getCartValue();

    const orderData = {
      items: currentCart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      })),
      total: currentCart.total,
      paymentMethod: paymentMethod,
      cardData: paymentMethod === 'card' ? cardData : undefined,
      timestamp: new Date().toISOString()
    };

    return this.http.post(this.orderUrl, orderData, { headers });
  }

  clearCart(): void {
    this.cartSubject.next({ items: [], total: 0 });
    const headers = this.authService.getAuthHeaders();
    this.http.delete(this.apiUrl, { headers }).subscribe({
      next: () => console.log('Carrito limpiado en el servidor'),
      error: (err) => console.error('Error limpiando carrito en servidor', err)
    });
  }


}