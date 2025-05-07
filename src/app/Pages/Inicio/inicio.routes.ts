import { RouterModule, Routes } from '@angular/router';
import { VistaInicialComponent } from './Components/vista-inicial/vista-inicial.component';
import { NgModule } from '@angular/core';
import { FiltrosComponent } from './Components/filtros/filtros.component';
import { ContactanosComponent } from './Components/contactanos/contactanos.component';
import { VerPropiedadComponent } from './Components/ver-propiedad/ver-propiedad.component';
import { NuestroEquipoComponent } from './Components/nuestro-equipo/nuestro-equipo.component';
import { QuienesSomosComponent } from './Components/quienes-somos/quienes-somos.component';
import { MapaComponent } from './Components/mapa/mapa.component';
import { BlogsComponent } from './Components/blogs/blogs.component';
import { VerBlogComponent } from './Components/ver-blog/ver-blog.component';
import { PublicarInmuebleComponent } from './Components/publicar-inmueble/publicar-inmueble.component';
import { PoliticarPrivacidadComponent } from './Components/politicar-privacidad/politicar-privacidad.component';
import { AvaluosComercialesComponent } from './Components/avaluos-comerciales/avaluos-comerciales.component';

export const routes: Routes = [

  { path: '', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    component: VistaInicialComponent
  },

  {
    path: 'filtros',
    component: FiltrosComponent
  },
  {
    path: 'filtros/:tipo',
    component: FiltrosComponent
  },
  {
    path: 'contacto',
    component: ContactanosComponent
  },
  {
    path: 'ver-propiedad/:codpro',
    component: VerPropiedadComponent
  },
  {
    path: 'nuestro-equipo',
    component: NuestroEquipoComponent
  },
  {
    path: 'quienes-somos',
    component: QuienesSomosComponent
  },
  {
    path: 'mapa',
    component: MapaComponent
  },
  {
    path: 'blogs',
    component: BlogsComponent
  },
  {
    path: 'ver-blog/:id',
    component: VerBlogComponent
  },
  {
    path: 'publicar-inmueble',
    component: PublicarInmuebleComponent
  },
  {
    path: 'politicas-de-privacidad',
    component: PoliticarPrivacidadComponent
  },
  {
    path: 'avaluos-comerciales',
    component: AvaluosComercialesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioRoutingModule { }
