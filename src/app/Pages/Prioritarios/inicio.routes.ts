import { Routes } from '@angular/router';

import { PrioritariosComponent } from './Components/prioritarios/prioritarios.component';
import { AppComponent } from '../../app.component';
import { VerPropiedadComponent } from '../Inicio/Components/ver-propiedad/ver-propiedad.component';
import { propiedadResolver } from '../../core/resolvers/propiedad.resolver';
import { FiltrosComponent } from '../Inicio/Components/filtros/filtros.component';

export const routes: Routes = [


  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: PrioritariosComponent,
      },
      {
        path: 'ver-propiedad/:codpro/:ocultarContenido',
        component: VerPropiedadComponent,
        resolve: { propiedad: propiedadResolver }
      },{
              path: 'filtros',
              component: FiltrosComponent,
            },
    ]

  },
];

