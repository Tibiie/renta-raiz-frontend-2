import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-botones-flotantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './botones-flotantes.component.html',
  styleUrl: './botones-flotantes.component.scss'
})
export class BotonesFlotantesComponent {
  @Input() hideWhatsApp: boolean = false;

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
