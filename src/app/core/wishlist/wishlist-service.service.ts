import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



export interface Favorito {
  codigo: string;
  nombre: string;
  imagen: string;
}
@Injectable({
  providedIn: 'root'
})
export class WishlistServiceService {
private favoritosSubject = new BehaviorSubject<any[]>(this.cargarFavoritos());
  favoritos$ = this.favoritosSubject.asObservable();

  private cargarFavoritos(): Favorito[] {
    return JSON.parse(localStorage.getItem('favoritos') || '[]');
  }

  private guardarFavoritos(favoritos: Favorito[]): void {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }

  agregar(fav: any): void {
    const favoritos = this.favoritosSubject.value;
    if (!favoritos.some(f => f.codigo === fav.codigo)) {
      const nuevos = [...favoritos, fav];
      this.favoritosSubject.next(nuevos);
      this.guardarFavoritos(nuevos);
    }
  }

  eliminar(codigo: string): void {
    const nuevos = this.favoritosSubject.value.filter(f => f.codigo !== codigo);
    this.favoritosSubject.next(nuevos);
    this.guardarFavoritos(nuevos);
  }
}
