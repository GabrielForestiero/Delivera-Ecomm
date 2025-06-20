import { Injectable } from '@angular/core';
import { Producto } from '../../modules/interfaces/producto';
import { MOCK_PRODUCTS } from '../../modules/interfaces/mock-product';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {



  constructor() { }


  getProducts(): Observable<Producto[]> {
    return of(MOCK_PRODUCTS); // simula una llamada HTTP
  }

  getProductById(id: number): Observable<Producto | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

}
