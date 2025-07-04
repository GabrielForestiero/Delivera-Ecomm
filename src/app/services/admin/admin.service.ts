import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Order {
  _id: any;
  status: string;
  total: number;
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
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/api/order`;
  private productUrl = `${environment.apiBaseUrl}/api/product`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-api-key': 'my-secret-api-key',
      'Content-Type': 'application/json'
    });
  }

  private getFormDataHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-api-key': 'my-secret-api-key'
    });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    const headers = this.getHeaders();
    return this.http.patch(`${this.apiUrl}/${orderId}`, { newOrderStatus: newStatus }, { headers });
  }

  createProduct(product: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    image?: File;
  }): Observable<any> {

    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    formData.append('originalStock', product.stock.toString());
    formData.append('category', product.category);

    if (product.description) {
      formData.append('description', product.description);
    }

    if (product.image) {
      formData.append('image', product.image, product.image.name);
    }

    const headers = this.getFormDataHeaders();

    return this.http.post(this.productUrl, formData, { headers });
  }
}