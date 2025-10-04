import { Component } from '@angular/core';

@Component({
  selector: 'app-politica-acoso',
  standalone: true,
  imports: [],
  templateUrl: './politica-acoso.component.html',
  styleUrl: './politica-acoso.component.scss'
})
export class PoliticaAcosoComponent {

   pdfUrl = '/assets/images/POLITICA_ACOSO_SEXUAL.pdf';
  isIOS = false;

  constructor() {
    this.isIOS = this.detectIOS();
  }

  private detectIOS(): boolean {
    if (typeof navigator !== 'undefined') {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    }
    return false;
  }

}
