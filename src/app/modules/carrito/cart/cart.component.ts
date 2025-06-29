import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/carrito/cart.service';
import { Cart } from '../../interfaces/cart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  isOpen = false;
  private subscription?: Subscription;

  
  cart: Cart | null = null;



  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.subscription = this.cartService.cartOpen$.subscribe(open => this.isOpen = open);

    this.subscription = this.cartService.getCart().subscribe({
      next: (cartData) => {
        this.cart = cartData;
      },
      error: (err) => {
        console.error('Error al cargar carrito', err);
      }
    });
  }

  incrementarCantidad(productId: number): void {
    this.cartService.addProduct(productId).subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => console.error('Error al aumentar cantidad', err)
    });
  }

  disminuirCantidad(productId: number): void {
    this.cartService.removeProduct(productId).subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => console.error('Error al disminuir cantidad', err)
    });
  }

  eliminarDelCarrito(productId: number): void {
    const item = this.cart?.items.find(i => i.productId === productId);
    if (item) {
      this.cartService.removeProduct(productId, item.quantity).subscribe({
        next: (cart) => this.cart = cart,
        error: (err) => console.error('Error al eliminar producto', err)
      });
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
