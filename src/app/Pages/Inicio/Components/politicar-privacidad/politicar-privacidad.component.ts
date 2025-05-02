import { Component } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { BotonesFlotantesComponent } from "../../../../shared/botones-flotantes/botones-flotantes.component";
import { FooterComponent } from "../../../../shared/footer/footer.component";

@Component({
  selector: 'app-politicar-privacidad',
  standalone: true,
  imports: [NavbarComponent, BotonesFlotantesComponent, FooterComponent],
  templateUrl: './politicar-privacidad.component.html',
  styleUrl: './politicar-privacidad.component.scss'
})
export class PoliticarPrivacidadComponent {

}
