import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-portafolio',
  standalone: true,
  imports: [],
  templateUrl: './footer-portafolio.component.html',
  styleUrl: './footer-portafolio.component.scss'
})
export class FooterPortafolioComponent {
   abrirPestana(url: string) {
    window.open(url, '_blank');
  }

}
