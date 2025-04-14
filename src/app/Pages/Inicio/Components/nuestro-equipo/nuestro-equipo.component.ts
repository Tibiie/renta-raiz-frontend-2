import { Component } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { BotonesFlotantesComponent } from "../../../../shared/botones-flotantes/botones-flotantes.component";
import { FooterComponent } from "../../../../shared/footer/footer.component";

@Component({
  selector: 'app-nuestro-equipo',
  standalone: true,
  imports: [NavbarComponent, BotonesFlotantesComponent, FooterComponent],
  templateUrl: './nuestro-equipo.component.html',
  styleUrl: './nuestro-equipo.component.scss'
})
export class NuestroEquipoComponent {

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

}
