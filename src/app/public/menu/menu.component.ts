import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MegaMenuModule } from 'primeng/megamenu';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { Subscription, combineLatest } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CartService } from '../../services/carrito/cart.service';
import { AuthService, User } from '../../services/auth/auth.service';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MegaMenuModule,
    RippleModule,
    AvatarModule,
    ButtonModule,
    RouterModule,
    SplitButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  isAdmin = false;
  user: User | null = null;

  private combinedSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router

  ) {}

  ngOnInit() {
    this.combinedSubscription = combineLatest([
      this.authService.isAuthenticated$,
      this.authService.user$
    ]).subscribe(([isAuth, user]) => {
      this.isAuthenticated = isAuth;
      this.user = user;
      this.isAdmin = user?.role === 'admin';
    });
  }

  ngOnDestroy() {
    this.combinedSubscription?.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  seeOrders() {
  this.router.navigate(['/my-orders']);
  }

  toggleCart() {
    this.cartService.toggleCart();
  }

}