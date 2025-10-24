import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { BotonesFlotantesComponent } from "../../../../shared/botones-flotantes/botones-flotantes.component";
import { FooterComponent } from "../../../../shared/footer/footer.component";
import { VolverComponent } from "../../../../shared/volver/volver.component";
import { BarraFiltrosComponent } from "../../../../shared/barra-filtros/barra-filtros.component";
import { Router } from 'express';

@Component({
  selector: 'app-nuestro-equipo',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, BotonesFlotantesComponent, VolverComponent, BarraFiltrosComponent],
  templateUrl: './nuestro-equipo.component.html',
  styleUrl: './nuestro-equipo.component.scss'
})
export class NuestroEquipoComponent implements OnInit {

  asesoresCode  = {
    "Juan Pablo Hoyos": "11370",
    "Sebastián Ospina": "41112",
    "Lenys Cuberos": "41132",
    "Andres Mejia": "67953",
    "David Peláez": "69627",
    "Juan Pablo Ospina": "45849"
  }

  router = inject(Router);


  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

  abrirPortafolio(asesorCode: string) {
    this.router.navigate(['/portafolio', asesorCode]).then(() => {
      window.scrollTo(0, 0); // opcional: para que siempre inicie arriba
    });
  }

}
