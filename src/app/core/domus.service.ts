import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomusService {

  http = inject(HttpClient);
}
