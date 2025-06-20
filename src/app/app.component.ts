import { Component } from '@angular/core';
import { MenuComponent } from "./public/menu/menu.component";
import { HomeComponent } from "./public/home/home.component";
import { ListProductosComponent } from "./modules/productos/list-productos/list-productos.component";

@Component({
  selector: 'app-root',
  imports: [MenuComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tw2-grupo6-front';
}
