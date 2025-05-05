import { Component } from '@angular/core';

@Component({
  selector: 'app-volver',
  standalone: true,
  imports: [],
  templateUrl: './volver.component.html',
  styleUrl: './volver.component.scss'
})
export class VolverComponent {

  vistaAnterior(): void {
    window.history.back();
  }
}
