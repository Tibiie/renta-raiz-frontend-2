import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ParamGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const hasParam = route.queryParamMap.has('biz');

    if (!hasParam) {
      this.router.navigate([], {
        queryParams: { biz: '1' },
        queryParamsHandling: 'merge'
      });


      return false;
    }
    return true;
  }
}