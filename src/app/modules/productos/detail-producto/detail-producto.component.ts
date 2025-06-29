import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CartService } from '../../../services/carrito/cart.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/productos/producto.service';



@Component({
  selector: 'app-detail-producto',
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './detail-producto.component.html',
  styleUrl: './detail-producto.component.css'
})
export class DetailProductoComponent {


  product?: Product;
  productQuantity: number = 0;
  private subscription?: Subscription;



  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {

  }


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(id).subscribe(p => {
      this.product = p;
    });

    this.cartService.getCart().subscribe();

    this.subscription = this.cartService.productQuantities$.subscribe(cantidad => {
      if (this.product) {
        this.productQuantity = cantidad[this.product.id] || 0;
      }
    });
  }



  agregarAlCarrito() {
    if (this.product) {
      this.cartService.addProduct(this.product.id).subscribe();
    }
  }

  eliminarDelCarrito() {
    if (this.product) {
      this.cartService.removeProduct(this.product.id).subscribe();
    }
  }

  goBack() { }


  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


}
