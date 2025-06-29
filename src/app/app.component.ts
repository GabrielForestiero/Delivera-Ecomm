import { Component } from '@angular/core';
import { MenuComponent } from "./public/menu/menu.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tw2-grupo6-front';
}
