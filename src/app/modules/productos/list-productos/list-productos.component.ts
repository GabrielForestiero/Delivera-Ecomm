import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Producto } from '../../interfaces/producto';
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

  carrito: Producto[] = [];
  products: Producto[] = [];

  constructor(private productService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }


  agregarAlCarrito(producto: Producto) {
    this.carrito.push(producto)

    console.log("Se agregó:  " + producto.name + " al carrito");

    }
  
    
  verProducto(id: number) {
    this.router.navigate(['/productos', id]);
  }

}
