import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UrlparamService } from './urlparam.service';


@Injectable({ providedIn: 'root' })
export class urlparamsGuard implements CanActivate {

  constructor(private urlParamService: UrlparamService, private router: Router) { }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const utmSource = this.urlParamService.obtenerParamLocalStorage('utm_source');

    const queryParams = route.queryParams;

    console.log(queryParams);
    

    

    // Si ya existe "lang", permite el acceso normal
    if (queryParams['utm_source'] != undefined || queryParams['utm_source'] != null) {
      
      return true;
    }

    // Si el param existe y no está ya en la URL
    if (utmSource && (queryParams['utm_source'] == undefined || queryParams['utm_source'] == null)) {
        
       const cleanPath = state.url.split('?')[0];
      return this.router.navigate([cleanPath], {  queryParams: {...queryParams ,utm_source: utmSource }, queryParamsHandling: 'merge' });
      

    }

    return true;

  }

}