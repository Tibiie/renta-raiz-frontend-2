import { ResolveFn } from '@angular/router';
import { InmueblesService } from '../Inmuebles/inmuebles.service';
import { inject } from '@angular/core';

export const propiedadResolver: ResolveFn<any> = (route, state) => {


   const inmueblesService = inject(InmueblesService);
   const codPro = route.paramMap.get('codpro');
   const ocultarContenido = route.paramMap.get('ocultarContenido');
   return inmueblesService.getDatosPropiedad(Number (codPro));

};
