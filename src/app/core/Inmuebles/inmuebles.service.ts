import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InmueblesService {

  constructor(private http: HttpClient) { }

  getInmueblesDestacados(): any {
    return this.http.get(`${environment.baseUrl}/properties`);
  }
}
