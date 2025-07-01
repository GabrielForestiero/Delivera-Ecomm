import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Cart, Item } from '../../modules/interfaces/cart';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

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


  // getCart(): Observable<Cart> {
  //   const headers = this.authService.getAuthHeaders();

  //   return new Observable((observer) => {
  //     this.http.get<Cart>(this.apiUrl, { headers: headers }).subscribe({
  //       next: (cart) => {
  //         this.productQuantities = {};
  //         cart.items.forEach((item: Item) => {
  //           this.productQuantities[item.productId] = item.quantity;
  //         });

  //         this.productQuantitiesSubject.next({ ...this.productQuantities });

  //         observer.next(cart);
  //         observer.complete();
  //       },
  //       error: (err) => observer.error(err)
  //     });
  //   });
  // }


  // addProduct(productId: string, quantity: number = 1): Observable<Cart> {
  //   const headers = this.authService.getAuthHeaders();

  //   this.productQuantities[productId] = (this.productQuantities[productId] || 0) + quantity;
  //   this.productQuantitiesSubject.next({ ...this.productQuantities });

  //   return this.http.post<Cart>(this.apiUrl, {
  //     productId,
  //     quantity,
  //     action: 'add'
  //   }, { headers: headers });
  // }

  // removeProduct(productId: string, quantity: number = 1): Observable<Cart> {
  //   const headers = this.authService.getAuthHeaders();

  //   const currentQty = this.productQuantities[productId] || 0;
  //   if (currentQty - quantity <= 0) {
  //     delete this.productQuantities[productId];
  //   } else {
  //     this.productQuantities[productId] = currentQty - quantity;
  //   }
  //   this.productQuantitiesSubject.next({ ...this.productQuantities });

  //   return this.http.post<Cart>(this.apiUrl, {
  //     productId,
  //     quantity,
  //     action: 'remove'
  //   }, { headers: headers });
  // }

  // clearCart(): Observable<any> {
  //   return this.http.delete(this.apiUrl, { headers: this.getHeaders() });
  // }



}
