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
  private subscription = new Subscription();



  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {

  }


  ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(id).subscribe(p => {
      this.product = p;
      this.updateProductQuantity();

    });


    this.subscription.add(
      this.cartService.cart$.subscribe(() => {
        this.updateProductQuantity();
      })
    );

    this.cartService.getCart();
  }


  agregarAlCarrito() {
    if (this.product) {
      this.cartService.addProduct(this.product._id)
    }
  }

  toggleCart(product: Product) {
    this.cartService.toggleCart();
    this.cartService.addProduct(product._id);
  }
  eliminarDelCarrito() {
    if (this.product) {
      this.cartService.removeProduct(this.product._id)
    }
  }

  private updateProductQuantity() {
    if (!this.product) return;
    const cart = this.cartService.getCartValue();
    const item = cart.items.find(i => i.productId === this.product!._id);
    this.productQuantity = item ? item.quantity : 0;
  }

  goBack() { }


  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


}
