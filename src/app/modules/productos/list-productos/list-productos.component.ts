import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/carrito/cart.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/productos/producto.service';


@Component({
  selector: 'app-list-productos',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  templateUrl: './list-productos.component.html',
  styleUrl: './list-productos.component.css'
})
export class ListProductosComponent {

  carrito: Product[] = [];
  products: Product[] = [];
  productQuantities: { [productId: number]: number } = {};

  private subscription?: Subscription;



  constructor(private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });

    
    this.cartService.getCart().subscribe({
      next: (cart) => console.log('Carrito cargado', cart),
      error: (err) => console.error('Error al cargar carrito', err)
    });


    this.subscription = this.cartService.productQuantities$.subscribe(cantidad => {
      this.productQuantities = cantidad;
    });
  }

  verProducto(id: number) {
    this.router.navigate(['/productos', id]);
  }




  agregarAlCarrito(product: Product) {
    this.cartService.addProduct(product.id).subscribe({
      next: (cart) => console.log('Producto agregado', cart),
      error: (err) => console.error('Error al agregar', err)
    });
  }

  eliminarDelCarrito(product: Product) {
    this.cartService.removeProduct(product.id).subscribe({
      next: (cart) => console.log('Producto eliminado', cart),
      error: (err) => console.error('Error al eliminar', err)
    });
  }

  getProductQuantity(productId: number): number {
    return this.productQuantities[productId] || 0;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }




}