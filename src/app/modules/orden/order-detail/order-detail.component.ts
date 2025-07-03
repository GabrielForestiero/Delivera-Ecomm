import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
  standalone: true,
  imports: [CommonModule],

})
export class OrderDetailComponent implements OnInit {

  order: any;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      'x-api-key': 'my-secret-api-key'
    });

    this.http.get(`http://localhost:3000/api/order/${orderId}`, { headers })
      .subscribe({
        next: (order) => {
          this.order = order;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'No se pudo cargar la orden.';
          this.isLoading = false;
        }
      });
  }
}
