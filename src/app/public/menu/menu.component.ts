import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MegaMenuModule } from 'primeng/megamenu';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-menu',
  imports: [CommonModule, MegaMenuModule, RippleModule, AvatarModule, ButtonModule, RouterModule, SplitButtonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

   categoryItems: MenuItem[] = [
    { label: 'Electrónica', icon: 'pi pi-desktop', command: () => this.onCategorySelect('Electrónica') },
    { label: 'Ropa', icon: 'pi pi-tags', command: () => this.onCategorySelect('Ropa') },
    { label: 'Accesorios', icon: 'pi pi-star', command: () => this.onCategorySelect('Accesorios') },
  ];

    onCategorySelect(category: string) {
    console.log('Categoría seleccionada:', category);
  }

 
}
