import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.scss'
})
export class QuienesSomosComponent {

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

}
