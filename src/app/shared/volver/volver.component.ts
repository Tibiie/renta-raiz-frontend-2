import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-volver',
  standalone: true,
  imports: [],
  templateUrl: './volver.component.html',
  styleUrl: './volver.component.scss'
})
export class VolverComponent {

  location = inject(Location);
  router = inject(Router);

  vistaAnterior(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
