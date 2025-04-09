import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./Pages/Inicio/inicio.routes').then((m) => m.InicioRoutingModule),
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
 
];
