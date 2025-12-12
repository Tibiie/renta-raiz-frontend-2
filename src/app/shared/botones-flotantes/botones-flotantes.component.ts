import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-botones-flotantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './botones-flotantes.component.html',
  styleUrl: './botones-flotantes.component.scss'
})
export class BotonesFlotantesComponent {
  @Input() hideWhatsApp: boolean = false;

  @Output() abrir = new EventEmitter<void>();

  

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  vistaAnterior(): void {
    window.history.back();
  }


  abrirOffcanvas() {
    this.abrir.emit()
  }
}
