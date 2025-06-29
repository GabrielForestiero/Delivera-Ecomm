import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../interfaces/product';
import { ProductoService } from '../../../services/productos/producto.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-list-productos',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  templateUrl: './list-productos.component.html',
  styleUrl: './list-productos.component.css'
})
export class ListProductosComponent {

  carrito: Product[] = [];
  products: Product[] = [];

  constructor(private productService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }


  agregarAlCarrito(producto: Product) {
    this.carrito.push(producto)

    console.log("Se agregó:  " + producto.name + " al carrito");

    }
  
    
  verProducto(id: number) {
    this.router.navigate(['/productos', id]);
  }

}
