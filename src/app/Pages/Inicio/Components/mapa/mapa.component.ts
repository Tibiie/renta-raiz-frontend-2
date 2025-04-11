import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent {

  
  center = { lat: 4.65, lng: -74.05 }; // centro de Bogotá


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
}
