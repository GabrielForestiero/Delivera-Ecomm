import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  private productQuantitiesSubject = new BehaviorSubject<{ [productId: number]: number }>({});
  productQuantities$ = this.productQuantitiesSubject.asObservable();
  private productQuantities: { [productId: number]: number } = {};

  private cartOpenSubject = new BehaviorSubject<boolean>(false);
  cartOpen$ = this.cartOpenSubject.asObservable();


  constructor(private http: HttpClient) { }


  openCart() {
    this.cartOpenSubject.next(true);
  }

  closeCart() {
    this.cartOpenSubject.next(false);
  }

  toggleCart() {
    this.cartOpenSubject.next(!this.cartOpenSubject.value);
  }



  getCart(): Observable<any> {
    return new Observable((observer) => {
      this.http.get(this.apiUrl).subscribe({
        next: (cart: any) => {
          this.productQuantities = {};
          cart.items.forEach((item: any) => {
            this.productQuantities[item.productId] = item.quantity;
          });

          this.productQuantitiesSubject.next(this.productQuantities);
          observer.next(cart);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }


  addProduct(productId: number, quantity: number = 1): Observable<any> {
    this.productQuantities[productId] = (this.productQuantities[productId] || 0) + quantity;
    this.productQuantitiesSubject.next({ ...this.productQuantities });

    return this.http.post(this.apiUrl, {
      productId,
      quantity,
      action: 'add'
    });
  }

  removeProduct(productId: number, quantity: number = 1): Observable<any> {
    const currentQty = this.productQuantities[productId] || 0;
    if (currentQty - quantity <= 0) {
      delete this.productQuantities[productId];
    } else {
      this.productQuantities[productId] = currentQty - quantity;
    }
    this.productQuantitiesSubject.next({ ...this.productQuantities });

    return this.http.post(this.apiUrl, {
      productId,
      quantity,
      action: 'remove'
    });
  }


  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }

}
