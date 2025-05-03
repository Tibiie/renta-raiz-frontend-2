import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  router = inject(Router);

  abrirPoliticas() {
    const url = this.router.createUrlTree(['/politicas-de-privacidad']).toString();
    window.open(url, '_blank');
  }

  redirigirPublicarPropiedad() {
    const url = this.router.createUrlTree(['/publicar-inmueble']).toString();
    window.open(url, '_blank');
  }

  redirigirContactanos() {
    this.router.navigate(['/contacto']);
  }

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }
}
