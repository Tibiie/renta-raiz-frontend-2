import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadChildren: () => import('./Pages/Inicio/inicio.routes').then(m => m.InicioRoutingModule)
    }
    
];
