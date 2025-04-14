import { Component } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";

@Component({
  selector: 'app-nuestro-equipo',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './nuestro-equipo.component.html',
  styleUrl: './nuestro-equipo.component.scss'
})
export class NuestroEquipoComponent {

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

}
