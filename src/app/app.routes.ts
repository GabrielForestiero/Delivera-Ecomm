import { Routes } from '@angular/router';
import { ListProductosComponent } from './modules/productos/list-productos/list-productos.component';
import { HomeComponent } from './public/home/home.component';
import { DetailProductoComponent } from './modules/productos/detail-producto/detail-producto.component';

export const routes: Routes = [
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
  {
    path: '**',
    redirectTo: ''
  }
];
