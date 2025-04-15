import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { BotonesFlotantesComponent } from "../../../../shared/botones-flotantes/botones-flotantes.component";
import { FooterComponent } from "../../../../shared/footer/footer.component";

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [NavbarComponent, BotonesFlotantesComponent, FooterComponent],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.scss'
})
export class QuienesSomosComponent {

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

}
