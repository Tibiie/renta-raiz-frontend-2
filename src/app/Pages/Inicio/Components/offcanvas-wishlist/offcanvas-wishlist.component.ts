import { Component } from '@angular/core';
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

  constructor(private favService: WishlistServiceService) { }

  ngOnInit(): void {
    this.favService.favoritos$.subscribe(favs => {
      this.favoritos = favs;
      if (favs.length > 0) this.visible = true;
    });
    console.log(this.favoritos);
    
  }

  cerrar(): void {
    this.visible = false;
  }

  eliminar(codigo: string): void {
    this.favService.eliminar(codigo);
  }

}
