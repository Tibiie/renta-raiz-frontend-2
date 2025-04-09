import { RouterModule, Routes } from '@angular/router';
import { VistaInicialComponent } from './Components/vista-inicial/vista-inicial.component';
import { NgModule } from '@angular/core';
import { FiltrosComponent } from './Components/filtros/filtros.component';
import { ContactanosComponent } from './Components/contactanos/contactanos.component';
import { VerPropiedadComponent } from './Components/ver-propiedad/ver-propiedad.component';

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
    path: 'ver-propiedad',
    component: VerPropiedadComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioRoutingModule { }
