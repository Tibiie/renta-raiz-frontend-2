import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { BotonesFlotantesComponent } from "../../../../shared/botones-flotantes/botones-flotantes.component";
import { FooterComponent } from "../../../../shared/footer/footer.component";
import { VolverComponent } from "../../../../shared/volver/volver.component";
import { BarraFiltrosComponent } from "../../../../shared/barra-filtros/barra-filtros.component";

@Component({
  selector: 'app-nuestro-equipo',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, BotonesFlotantesComponent, VolverComponent, BarraFiltrosComponent],
  templateUrl: './nuestro-equipo.component.html',
  styleUrl: './nuestro-equipo.component.scss'
})
export class NuestroEquipoComponent implements OnInit {

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

}
