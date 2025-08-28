import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UrlParamService } from '../../core/configs/url-param.service';

@Component({
  selector: 'app-volver',
  standalone: true,
  imports: [],
  templateUrl: './volver.component.html',
  styleUrl: './volver.component.scss'
})
export class VolverComponent {

  location = inject(Location);
  router = inject(Router);
  urlParamService = inject(UrlParamService);

  vistaAnterior(): void {

    var data = this.urlParamService.obtenerParamLocalStorage('data');

    if (data) {
      var obj = JSON.parse(data);
      
      if (obj.url.includes('filtros')) {
        this.router.navigate(['/filtros'], {
          queryParams: obj.filtros,
          state: {
            resultados: obj.resultados,
            paginacion: obj.paginacion,
            filtros: obj.filtros,
          },
        });
        return;
      }else{
        this.router.navigate(['']);
      }


      

    }
    

    this.router.navigate(['']);

  }
}
