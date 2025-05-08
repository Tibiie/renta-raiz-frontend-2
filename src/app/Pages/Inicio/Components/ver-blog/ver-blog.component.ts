import { Component, inject, Inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';
import { BarraFiltrosComponent } from "../../../../shared/barra-filtros/barra-filtros.component";
import { VolverComponent } from "../../../../shared/volver/volver.component";

@Component({
  selector: 'app-ver-blog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    BotonesFlotantesComponent,
    BarraFiltrosComponent,
    VolverComponent
  ],
  templateUrl: './ver-blog.component.html',
  styleUrl: './ver-blog.component.scss'
})
export class VerBlogComponent implements OnInit {

  blogId: string = "";

  elementsPerPage = 12;

  blog1:string =  "medellin-brilla-en-los-stella-awards-2025-la-ciudad-que-enamora-al-mundo-y-se-vuelve-epicentro-de-inversion-inmobiliaria"

  blog2:string =  "medellin-el-nuevo-epicentro-del-lujo-en-america-latina-para-invertir-rentar-o-comprar-propiedades-exclusivas"

  blog3:string = "por-que-medellin-se-ha-convertido-en-el-lugar-ideal-para-vivir-e-invertir-en-tiempos-de-cambio"
  inmueblesDestacadosArray: any = {};

  router = inject(Router);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  inmueblesService = inject(InmueblesService);

  ngOnInit(): void {
    this.getDatos();
    this.route.params.subscribe(params => {
      this.blogId = params['id'];
    });
  }

  getDatos() {
    this.getInmueblesDestacados();
  }

  getInmueblesDestacados() {
    this.inmueblesService.getInmueblesDestacados().subscribe(
      (data: any) => {
        this.inmueblesDestacadosArray = data.data.slice(2, 5);
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener los inmuebles:', error);
      }
    );
  }

  verPropiedad(codPro: number) {
    const url = this.router.createUrlTree(['/ver-propiedad', codPro]).toString();
    window.open(url, '_blank');
  }
}
