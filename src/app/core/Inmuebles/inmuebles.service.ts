import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InmueblesService {

  http = inject(HttpClient);

  getInmueblesDestacados() {
    return this.http.get(`${environment.baseUrl}/properties/destacados`);
  }

  getTipoPropiedad() {
    return this.http.get(`${environment.baseUrl}/properties/tipoPropiedad`);
  }

  getCategoriasInmuebles() {
    return this.http.get(`${environment.baseUrl}/properties/categoriasInmueble`);
  }

  getFiltros() {
    return this.http.get(`${environment.baseUrl}/properties/filtros`);
  }

  getFiltrosEnviar(filtros: any, elementsPerPage: number) {
    return this.http.get(`${environment.baseUrl}/properties/?elementsPerPage=${elementsPerPage}`, { params: filtros });
  }
}
