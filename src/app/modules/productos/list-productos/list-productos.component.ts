import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/carrito/cart.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/productos/producto.service';
import { Cart } from '../../interfaces/cart';


@Component({
  selector: 'app-list-productos',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  templateUrl: './list-productos.component.html',
  styleUrl: './list-productos.component.css'
})
export class ListProductosComponent {

  carrito: Cart = { items: [], total: 0 }; 
  products: Product[] = [];
  productQuantities: { [productId: string]: number } = {};

  private subscription = new Subscription();



  constructor(private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products)
    });

    
    this.cartService.getCart();

    this.subscription.add(
      this.cartService.cart$.subscribe(cart => {
        this.carrito = cart;
        console.log('Carrito actualizado', cart);
      })
    );
  }

  verProducto(id: string) {
    this.router.navigate(['/productos', id]);
  }




  agregarAlCarrito(product: Product) {
    this.cartService.addProduct(product._id)
  }

  eliminarDelCarrito(product: Product) {
    this.cartService.removeProduct(product._id)
  }

  getProductQuantity(productId: string): number {
    const item = this.carrito.items.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }




}