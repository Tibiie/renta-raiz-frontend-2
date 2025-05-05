import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-botones-flotantes',
  standalone: true,
  imports: [],
  templateUrl: './botones-flotantes.component.html',
  styleUrl: './botones-flotantes.component.scss'
})
export class BotonesFlotantesComponent {

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  vistaAnterior(): void {
    window.history.back();
  }
}
