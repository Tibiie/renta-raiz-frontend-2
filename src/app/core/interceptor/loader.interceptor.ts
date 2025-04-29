import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos el servicio del loader
  const loaderService = inject(NgxUiLoaderService);
  let requestCount = 0;

  // Excluimos ciertas peticiones si es necesario
  // const excludedUrls = ['/api/status', '/assets/'];
  // if (excludedUrls.some((url) => req.url.includes(url))) {
  //   return next(req);
  // }

  // Incrementamos el contador y mostramos el loader
  requestCount++;
  if (requestCount === 1) {
    console.log('INTERCEPTOR: iniciando petición');

    loaderService.start();
  }

  return next(req).pipe(
    finalize(() => {
      // Decrementamos el contador y ocultamos el loader cuando todas las peticiones completan
      requestCount--;
      if (requestCount === 0) {
        loaderService.stop();
      }
    })
  );
};
