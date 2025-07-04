import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product';
import { Cart } from '../../interfaces/cart';
import { ProductService } from '../../../services/productos/producto.service';
import { CartService } from '../../../services/carrito/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputTextModule, DropdownModule, CardModule, ButtonModule, PaginatorModule],
  templateUrl: './list-productos.component.html',
  styleUrl: './list-productos.component.css'
})
export class ListProductosComponent {
  carrito: Cart = { items: [], total: 0 };
  products: Product[] = [];
  categories: string[] = [
    'Bebidas', 'Comidas', 'Postres', 'Snacks', 'Cerveza', 'Vino', 'Tragos', 'Sin alcohol',
    'Promoción', 'Happy Hour', 'Vegano', 'Apto Celíacos', 'Café y Té', 'Entradas', 'Hamburguesas',
    'Pizzas', 'Pastas', 'Sushi', 'Otros'
  ];

  searchName = '';
  selectedCategory = '';
  currentPage = 1;
  itemsPerPage = 9;
  totalItems = 0;

  private subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const storedName = localStorage.getItem('searchName');
    const storedCategory = localStorage.getItem('selectedCategory');

    if (storedName) this.searchName = storedName;
    if (storedCategory) this.selectedCategory = storedCategory;

    this.loadProducts();

    this.cartService.getCart();
    this.subscription.add(
      this.cartService.cart$.subscribe(cart => {
        this.carrito = cart;
      })
    );

  }

  loadProducts(): void {
    this.productService.getFilteredProducts(this.searchName, this.selectedCategory
    ).subscribe(({ products, total }) => {
      this.products = products;
      this.totalItems = total;
    });
  }
  verProducto(id: string) {
    this.router.navigate(['/productos', id]);
  }

  clearFilters() {
    this.searchName = '';
    this.selectedCategory = '';
    this.currentPage = 1;


    localStorage.removeItem('searchName');
    localStorage.removeItem('selectedCategory');

    this.loadProducts();
  }


  onFilterChange() {
    this.currentPage = 1;

    localStorage.setItem('searchName', this.searchName);
    localStorage.setItem('selectedCategory', this.selectedCategory);

    this.loadProducts();
  }

  toggleCart(product: Product) {
    this.cartService.toggleCart();
    this.cartService.addProduct(product._id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
