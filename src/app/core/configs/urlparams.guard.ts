import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UrlParamService } from './url-param.service';

@Injectable({ providedIn: 'root' })
export class urlparamsGuard implements CanActivate {

  constructor(private urlParamService: UrlParamService, private router: Router) { }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const utmSource = this.urlParamService.obtenerParamLocalStorage('utm_source');

    const queryParams = route.queryParams;

    console.log(queryParams);
    

    

    // Si ya existe "lang", permite el acceso normal
    if (queryParams['utm_source'] != undefined || queryParams['utm_source'] != null) {
      
      return true;
    }

     // Si hay valor en localStorage pero no en la URL
  if (utmSource) {
    const cleanPath = state.url.split('?')[0];

    return this.router.createUrlTree([cleanPath], {
      queryParams: { ...queryParams, utm_source: utmSource },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  return true;
  }

}