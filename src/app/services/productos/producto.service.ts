import { Injectable } from '@angular/core';
import { Product } from '../../modules/interfaces/product';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }





  getProducts(): Observable<Product[]> {
    const headers = this.authService.getAuthHeaders();

    return this.http.get<{ products: any[] }>(this.apiUrl, { headers }).pipe(
      map(response => response.products)
    );
  }

  getProductById(id: string): Observable<Product> {
    const headers = this.authService.getAuthHeaders();

    return this.http.get<{ products: Product }>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map(response => response.products)
    );
  }


  createProduct(product: Product): Observable<Product> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Product>(this.apiUrl, product, {
      headers: headers
    });
  }


}
