import { Component, inject, Inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';
import { BarraFiltrosComponent } from "../../../../shared/barra-filtros/barra-filtros.component";

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
    BarraFiltrosComponent
  ],
  templateUrl: './ver-blog.component.html',
  styleUrl: './ver-blog.component.scss'
})
export class VerBlogComponent implements OnInit {

  blogId: number = 0;

  elementsPerPage = 12;

  inmueblesDestacadosArray: any = {};

  router = inject(Router);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  inmueblesService = inject(InmueblesService);

  ngOnInit(): void {
    this.getDatos();
    this.route.params.subscribe(params => {
      this.blogId = +params['id'];
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
