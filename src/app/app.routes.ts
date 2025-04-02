import { Routes } from '@angular/router';
import { VistaInicialComponent } from './Pages/Inicio/Components/vista-inicial/vista-inicial.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'vista-inicial',
        pathMatch: 'full'
    },

    {
        path: 'vista-inicial',
        component: VistaInicialComponent

    }
];
