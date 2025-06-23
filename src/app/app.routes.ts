import { Routes } from '@angular/router';
import { ListProductosComponent } from './modules/productos/list-productos/list-productos.component';
import { HomeComponent } from './public/home/home.component';
import { DetailProductoComponent } from './modules/productos/detail-producto/detail-producto.component';
import { RegisterComponent } from '../app/public/register/register.component';
import { LoginComponent } from '../app/public/login/login.component';


export const routes: Routes = [
  // Rutas de autenticación (públicas)
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
  
  // Rutas principales de la aplicación
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ListProductosComponent  // ruta por defecto dentro de home
      },
      {
        path: 'productos/:id',
        component: DetailProductoComponent
      }
    ]
  },
  
  // Redirección para rutas no encontradas
  {
    path: '**',
    redirectTo: ''
  }
];