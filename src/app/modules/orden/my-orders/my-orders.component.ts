import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {

  order: any;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router

  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      'x-api-key': 'my-secret-api-key'
    });

    this.http.get('http://localhost:3000/api/order/', { headers })
      .subscribe({
        next: (order) => {
          this.order = order;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'No se pudieron cargar las ordenes.';
          this.isLoading = false;
        }
      });
  }

  goToOrderDetail(id: string) {
    this.router.navigate(['/orden', id]);
  }
}
