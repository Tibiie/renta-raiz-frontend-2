import { ResolveFn } from '@angular/router';
import { InmueblesService } from '../Inmuebles/inmuebles.service';
import { inject } from '@angular/core';

export const blogsResolver: ResolveFn<any> = (route, state) => {

   const inmueblesService = inject(InmueblesService);
   const id = route.paramMap.get('id');
   
   return inmueblesService.getInmueblesDestacados(1);

};
