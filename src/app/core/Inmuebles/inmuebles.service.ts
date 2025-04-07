import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InmueblesService {

  http = inject(HttpClient);

  getInmueblesDestacados(): any {
    return this.http.get(`${environment.baseUrl}/properties/destacados`);
  }
}
