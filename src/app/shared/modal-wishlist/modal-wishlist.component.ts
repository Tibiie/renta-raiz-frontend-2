import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { WishlistServiceService } from '../../core/wishlist/wishlist-service.service';

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

  @Output() cerrar = new EventEmitter<void>();


  favService = inject(WishlistServiceService);

  ngOnInit(): void {

    var recorrido = this.favService.cargarFavoritos();

    const resultado = recorrido.map((item:any) => ({
      codpro: item.codpro,
      address: item.address,
      city: item.city
    }));

    const cadena = JSON.stringify(resultado);

    const cadenaCodificada = encodeURIComponent(cadena);

    console.log(cadena);


    var url = `${this.urlIframe}?historial_web=${cadenaCodificada}`

    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }



  cerrarModal() {
    this.cerrar.emit();
  }

}
