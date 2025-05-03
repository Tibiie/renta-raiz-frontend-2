import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { BarraFiltrosComponent } from '../../../../shared/barra-filtros/barra-filtros.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-politicar-privacidad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent,
    BotonesFlotantesComponent,
    FooterComponent,
    BarraFiltrosComponent,
  ],
  templateUrl: './politicar-privacidad.component.html',
  styleUrl: './politicar-privacidad.component.scss',
})
export class PoliticarPrivacidadComponent implements OnInit {
  inmueblesDestacadosArray: any = {};

  inmueblesService = inject(InmueblesService);
  router = inject(Router);

  ngOnInit(): void {
    this.getInmueblesDestacados();
  }

  getInmueblesDestacados() {
    this.inmueblesService.getInmueblesDestacados().subscribe(
      (data: any) => {
        this.inmueblesDestacadosArray = [
          data.data[0],
          data.data[2],
          data.data[3],
          data.data[4],
        ];
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener los inmuebles:', error);
      }
    );
  }

  verPropiedad(codPro: number) {
    const url = this.router
      .createUrlTree(['/ver-propiedad', codPro])
      .toString();
    window.open(url, '_blank');
  }
}
