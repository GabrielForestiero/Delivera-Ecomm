import { Injectable } from '@angular/core';
import { Product } from '../../modules/interfaces/product';
import { MOCK_PRODUCTS } from '../../modules/interfaces/mock-product';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {



  constructor() { }


  getProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS); // simula una llamada HTTP
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

}
