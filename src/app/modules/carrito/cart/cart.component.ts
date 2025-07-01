import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/carrito/cart.service';
import { Cart } from '../../interfaces/cart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, ButtonModule, CardModule,],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  isOpen = false;
  cart: Cart = { items: [], total: 0 };

  private subscription?: Subscription;



  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.subscription = this.cartService.cartOpen$.subscribe(open => this.isOpen = open);

    this.cartService.getCart();

    this.subscription.add(
      this.cartService.cart$.subscribe(cartData => {
        this.cart = cartData;
      })
    );

    
  }

  incrementarCantidad(productId: string): void {
    this.cartService.addProduct(productId)
  }

  disminuirCantidad(productId: string): void {
    this.cartService.removeProduct(productId)
  }

  eliminarDelCarrito(productId: string): void {
    const item = this.cart.items.find(i => i.productId === productId);
    if (item) {
      this.cartService.removeProduct(productId, item.quantity);
    }
  }

  checkout(): void {
    alert('Compra finalizada!');
  }


  close() {
    this.cartService.closeCart();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
