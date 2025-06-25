import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Order {
  _id: any;
  status: string;
  total: number
  paymentMethod: 'card' | 'cash' | 'paypal' | string;
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

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-api-key': 'my-secret-api-key',
      'Content-Type': 'application/json'
    });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

updateOrderStatus(orderId: string, newStatus: string) {
  const token = localStorage.getItem('auth_token');

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-api-key': 'my-secret-api-key'
  });

  return this.http.patch(`${this.apiUrl}/${orderId}`, { newOrderStatus: newStatus }, { headers });
}


}
