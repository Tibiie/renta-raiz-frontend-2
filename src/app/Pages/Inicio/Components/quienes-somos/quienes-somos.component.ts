import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { BotonesFlotantesComponent } from "../../../../shared/botones-flotantes/botones-flotantes.component";
import { FooterComponent } from "../../../../shared/footer/footer.component";
import { VolverComponent } from "../../../../shared/volver/volver.component";
import { BarraFiltrosComponent } from "../../../../shared/barra-filtros/barra-filtros.component";

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [NavbarComponent, BotonesFlotantesComponent, FooterComponent, VolverComponent, BarraFiltrosComponent],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.scss'
})
export class QuienesSomosComponent implements OnInit {

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

}
