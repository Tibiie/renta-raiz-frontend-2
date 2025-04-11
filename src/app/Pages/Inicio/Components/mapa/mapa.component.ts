import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent {

  

  center = { lat: 4.65, lng: -74.05 }; // centro de Bogotá
  markers: any[] = [];

  propiedades: any[] = [
    {
      id: 1,
      nombre: 'Apartamento en Chapinero',
      lat: 4.6462,
      lng: -74.0628
    },
    {
      id: 2,
      nombre: 'Casa en Suba',
      lat: 4.7434,
      lng: -74.0924
    },
    {
      id: 3,
      nombre: 'Apartamento en Teusaquillo',
      lat: 4.6382,
      lng: -74.0789
    },
    {
      id: 4,
      nombre: 'Apartamento en Usaquén',
      lat: 4.6925,
      lng: -74.0303
    },
    {
      id: 5,
      nombre: 'Casa en Kennedy',
      lat: 4.6255,
      lng: -74.1663
    }
  ];


  constructor(private router: Router) {
    this.markers = this.propiedades.map(p => ({
      position: { lat: p.lat, lng: p.lng },
      icon: this.createSvgIcon('1.000.000'),
      propiedad: p
    }));
  }


  createSvgIcon(precio: string) {
    const svg = `
      <svg width="130" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect rx="20" ry="20" width="130" height="40" fill="white" stroke="#007BFF" stroke-width="2"/>
        <text x="10" y="25" font-size="18" font-family="Arial" fill="#007BFF">🏢</text>
        <text x="40" y="25" font-size="14" font-weight="bold" font-family="Arial" fill="#007BFF">$${precio}</text>
      </svg>
    `;
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new google.maps.Size(130, 40),
      anchor: new google.maps.Point(65, 40)
    };
  }


  verDetalle(propiedad: any) {

    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/ver-propiedad/${propiedad.id}`])
    );
  
    // abre la nueva pestaña con la URL completa
    window.open(url, '_blank');
   
  }
}
