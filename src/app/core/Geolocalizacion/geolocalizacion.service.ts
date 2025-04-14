import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService {

  constructor() { }


  getCurrentPosition(): Promise<{latitude: number, longitude: number}> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(this.getErrorMessage(error));
          },
          {
            enableHighAccuracy: true, // Mayor precisión (usa GPS si disponible)
            timeout: 10000, // 10 segundos de espera
            maximumAge: 0 // No usar caché
          }
        );
      } else {
        reject('Geolocalización no soportada en este navegador');
      }
    });
  }

  private getErrorMessage(error: GeolocationPositionError): string {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        return 'Permiso denegado. Por favor habilita los permisos de ubicación.';
      case error.POSITION_UNAVAILABLE:
        return 'Información de ubicación no disponible.';
      case error.TIMEOUT:
        return 'Tiempo de espera agotado al obtener la ubicación.';
      default:
        return 'Error desconocido al obtener la ubicación.';
    }
  }

}
