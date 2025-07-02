import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartComponent } from '../../modules/carrito/cart/cart.component';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, CartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
