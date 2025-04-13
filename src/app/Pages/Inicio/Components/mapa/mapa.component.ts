import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';


@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent implements AfterViewInit {

  @ViewChild(GoogleMap, { static: false }) googleMap!: GoogleMap;

  center = { lat: 4.65, lng: -74.05 };
  zoom = 12;
  markers: any[] = [];

  @Input() propiedades: any[] = [];

  inmueblesService = inject(InmueblesService);


  constructor(private router: Router) {

  }
  ngOnInit(): void {
    if (this.propiedades.length == 0) {
      this.inmueblesService.getTodosInmuebles().subscribe(
        (response: any) => {

          this.propiedades = response;
          console.log(this.propiedades);
          console.log(this.propiedades);
          this.center = { lat: this.propiedades[0].latitude, lng: this.propiedades[0].longitude };

          this.markers = this.propiedades.map(p => ({
            position: { lat: p.latitude, lng: p.longitude },
            icon: this.createSvgIcon(p.price_format),
            propiedad: p
          }));
          console.log(this.markers);
        },
        (error: any) => {
          console.error('Error al obtener las propiedades:', error);
        }
      );
    }else{
      
      console.log("Propiedades recibidas:",this.propiedades);
      this.zoom = 16;
      var latitude = Number(this.propiedades[0].latitude);
      var longitude = Number(this.propiedades[0].longitude);
      this.center = { lat: latitude, lng: longitude };
      this.markers = this.propiedades.map(p => ({
        position: { lat: latitude, lng:longitude },
        // icon: this.createSvgIcon(p.price_format),
        propiedad: p
      }));
      
    }
    
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.forceResize();
    }, 500); // esperamos a que el DOM esté listo
  }

  forceResize(): void {
    const map = this.googleMap?.googleMap;
    if (map) {
      google.maps.event.trigger(map, 'resize');
      const center = map.getCenter();
      if (center) {
        map.setCenter(center); // re-centramos
      }
    }
  }

  createSvgIcon(precio: string) {


    const svg = `
      <svg width="130" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect rx="20" ry="20" width="130" height="40" fill="#060f29" stroke="#cdad60" stroke-width="2"/>
        <text x="10" y="25" font-size="18" font-family="Arial" fill="#cdad60">🏢</text>
        <text x="40" y="25" font-size="14" font-weight="bold" font-family="Arial" fill="#cdad60">$${precio}</text>
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
      this.router.createUrlTree([`/ver-propiedad/${propiedad.codPro}`])
    );

    // abre la nueva pestaña con la URL completa
    window.open(url, '_blank');

  }
}
