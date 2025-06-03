import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlParamService {

  constructor() { }


  guardarParamLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  obtenerParamLocalStorage(key: string) {
  var valor = localStorage.getItem(key);
    if (valor) {
      return valor;
    }
    return null;
  }

  
}
