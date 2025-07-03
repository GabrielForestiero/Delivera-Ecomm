import { Routes } from '@angular/router';
import { ListProductosComponent } from './modules/productos/list-productos/list-productos.component';
import { HomeComponent } from './public/home/home.component';
import { DetailProductoComponent } from './modules/productos/detail-producto/detail-producto.component';
import { RegisterComponent } from '../app/public/register/register.component';
import { LoginComponent } from '../app/public/login/login.component';
import { AdminDashboardComponent } from '../app/public/admin-dashboard/admin-dashboard';
import { AdminGuard } from './guards/admin.guard'; // Importar el AdminGuard
import { OrderDetailComponent } from './modules/orden/order-detail/order-detail.component';
import { MyOrdersComponent } from './modules/orden/my-orders/my-orders.component';


export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent
      },
      {
        path: 'dashboard',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
  
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ListProductosComponent
      },
      {
        path: 'productos/:id',
        component: DetailProductoComponent
      },
      {
        path: 'orden/:id',
        component: OrderDetailComponent
      },
      {
        path: 'my-orders',
        component: MyOrdersComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];