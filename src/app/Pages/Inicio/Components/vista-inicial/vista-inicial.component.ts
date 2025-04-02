import { Component } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";

@Component({
  selector: 'app-vista-inicial',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './vista-inicial.component.html',
  styleUrl: './vista-inicial.component.scss'
})
export class VistaInicialComponent {

  isDropdownOpen = false;
  selectedOption = 'Compra usado';

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }
}
