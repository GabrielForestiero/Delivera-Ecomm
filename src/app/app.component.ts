import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "./public/menu/menu.component";
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'tw2-grupo6-front';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.initializeUser();

    const user = this.authService.getCurrentUser();
    const token = this.authService.getToken();
    const currentUrl = this.router.url;

    const isAuthRoute = currentUrl.startsWith('/auth');
    const isOrderDetail = currentUrl.startsWith('/orden/');
    const isAllMyOrders = currentUrl.startsWith('/orden/');

    if ((!user || !token) && !isAuthRoute && !isOrderDetail && !isAllMyOrders) {
      this.router.navigate(['/auth/login']);
    }
  }
}
