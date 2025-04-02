import { RouterModule, Routes } from '@angular/router';
import { VistaInicialComponent } from './Components/vista-inicial/vista-inicial.component';

export const routes: Routes = [

  { path: '', redirectTo: 'vista-inicial', pathMatch: 'full' },

    {
        path: 'vista-inicial',
        component: VistaInicialComponent
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioRoutingModule { }
