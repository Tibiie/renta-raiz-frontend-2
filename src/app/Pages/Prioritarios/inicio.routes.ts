import {  Routes } from '@angular/router';

import { PrioritariosComponent } from './Components/prioritarios/prioritarios.component';
import { AppComponent } from '../../app.component';

export const routes: Routes = [


  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: PrioritariosComponent,
      },
    ]
   
  },
];

