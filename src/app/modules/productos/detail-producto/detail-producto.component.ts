import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../services/productos/producto.service';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-detail-producto',
  imports: [CommonModule, ButtonModule],
  templateUrl: './detail-producto.component.html',
  styleUrl: './detail-producto.component.css'
})
export class DetailProductoComponent {


  product?: Producto;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductoService
  ) {

  }


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(p => this.product = p);
  }

  goBack() {
    throw new Error('Method not implemented.');
  }

}
