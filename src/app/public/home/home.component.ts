import { Component } from '@angular/core';
import { ListProductosComponent } from "../../modules/productos/list-productos/list-productos.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
