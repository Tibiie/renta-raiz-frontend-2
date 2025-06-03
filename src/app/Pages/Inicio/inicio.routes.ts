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
import { EnvioExitosoComponent } from '../../shared/envio-exitoso/envio-exitoso.component';
import { urlparamsGuard } from '../../core/configs/urlparams.guard';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    component: VistaInicialComponent,
    canActivate: [urlparamsGuard]
  },

  {
    path: 'filtros',
    component: FiltrosComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'filtros/:tipo',
    component: FiltrosComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'contacto',
    component: ContactanosComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'ver-propiedad/:codpro',
    component: VerPropiedadComponent,
     canActivate: [urlparamsGuard]
 
  },
  {
    path: 'nuestro-equipo',
    component: NuestroEquipoComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'quienes-somos',
    component: QuienesSomosComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'mapa',
    component: MapaComponent,
  },
  {
    path: 'blogs',
    component: BlogsComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'ver-blog/:id',
    component: VerBlogComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'publicar-inmueble',
    component: PublicarInmuebleComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'politicas-de-privacidad',
    component: PoliticarPrivacidadComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'avaluos-comerciales',
    component: AvaluosComercialesComponent,
    canActivate: [urlparamsGuard]
  },
  {
    path: 'formulario-enviado-con-exito',
    component: EnvioExitosoComponent,
    canActivate: [urlparamsGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioRoutingModule {}