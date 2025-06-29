import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/productos/product.service';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';



@Component({
  selector: 'app-detail-producto',
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './detail-producto.component.html',
  styleUrl: './detail-producto.component.css'
})
export class DetailProductoComponent {


  product?: Product;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {

  }


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(p => this.product = p);
  }

  goBack() {
    
  }

}
