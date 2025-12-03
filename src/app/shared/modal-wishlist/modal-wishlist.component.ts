import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-wishlist.component.html',
  styleUrl: './modal-wishlist.component.scss'
})
export class ModalWishlistComponent implements OnInit {


  visible: boolean = false;
  sanitizer = inject(DomSanitizer);
  iframeId = '1WJfiMGJcT4VpcFo1G8h_1763138081735';
  iframeTitle = '';
  urlIframe = "https://api.leadconnectorhq.com/widget/booking/1WJfiMGJcT4VpcFo1G8h"
  iframeSrc: any = "";
  iframeHeight = 600;

  @Input() mostrarModalRecorrido = false

  ngOnInit(): void {
     this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlIframe)
  }


  abrirModalAgendarRecorrido() {
    this.mostrarModalRecorrido = true;
   
  }

  cerrarModal() {
    this.mostrarModalRecorrido = false
  }

}
