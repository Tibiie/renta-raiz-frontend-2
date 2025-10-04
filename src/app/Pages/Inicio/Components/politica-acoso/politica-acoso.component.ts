import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-politica-acoso',
  standalone: true,
  imports: [],
  templateUrl: './politica-acoso.component.html',
  styleUrl: './politica-acoso.component.scss'
})
export class PoliticaAcosoComponent implements OnInit{
  safeUrl!: SafeResourceUrl;
  isSafariOrIOS = false;

   pdfUrl = '/assets/images/POLITICA_ACOSO_SEXUAL.pdf';
  isIOS = false;

  constructor() {
   
  }
  ngOnInit(): void {
     this.isSafariOrIOS = this.detectSafariOrIOS();

     if (this.isSafariOrIOS) {
      // En iOS/Safari abrir el PDF directamente
      this.openPdfExternally();
    }
  }

   private detectSafariOrIOS(): boolean {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return isIOS || isSafari;
  }


  private openPdfExternally(): void {
    // Abre el PDF en una nueva pestaña para que iOS/Safari lo maneje nativamente
    window.open(this.pdfUrl, '_blank');
  }
}
