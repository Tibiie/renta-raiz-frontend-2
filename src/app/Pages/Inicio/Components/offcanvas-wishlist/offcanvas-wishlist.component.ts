import { Component, ElementRef, HostListener } from '@angular/core';
import { Favorito, WishlistServiceService } from '../../../../core/wishlist/wishlist-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offcanvas-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offcanvas-wishlist.component.html',
  styleUrl: './offcanvas-wishlist.component.scss'
})
export class OffcanvasWishlistComponent {

  favoritos: any[] = [];
  visible = false;
  minimizado: boolean = false;


  constructor(private favService: WishlistServiceService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.favService.favoritos$.subscribe(favs => {
      this.favoritos = favs;
      if (favs.length > 0) this.visible = true;
    });
    console.log(this.favoritos);

  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickDentro = this.elementRef.nativeElement.contains(event.target);

    if (!clickDentro) {
      this.minimizado = true; // Se minimiza
    }
  }

  cerrar(): void {
    this.visible = false;
  }
  toggleMinimizado() {
    this.minimizado = !this.minimizado;
  }

  eliminar(codigo: string): void {
    this.favService.eliminar(codigo);
  }

  limpiar(): void {
    this.favService.eliminarAll();
   this.favoritos = [];
   this.cerrar();
  }



}
