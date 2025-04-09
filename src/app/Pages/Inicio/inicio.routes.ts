import { RouterModule, Routes } from '@angular/router';
import { VistaInicialComponent } from './Components/vista-inicial/vista-inicial.component';
import { NgModule } from '@angular/core';
import { FiltrosComponent } from './Components/filtros/filtros.component';
import { ContactanosComponent } from './Components/contactanos/contactanos.component';
import { QuienesSomosComponent } from './Components/quienes-somos/quienes-somos.component';

export const routes: Routes = [

  { path: '', redirectTo: 'venta', pathMatch: 'full' },

  {
    path: 'venta',
    component: VistaInicialComponent
  },

  {
    path: 'filtros',
    component: FiltrosComponent
  },
  {
    path: 'contacto',
    component: ContactanosComponent
  },
  {
    path: 'quienes-somos',
    component: QuienesSomosComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioRoutingModule { }
