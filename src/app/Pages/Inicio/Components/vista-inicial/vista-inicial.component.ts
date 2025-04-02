import { Component } from '@angular/core';
import { NavbarComponent } from "../../../../Components/navbar/navbar.component";

@Component({
  selector: 'app-vista-inicial',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './vista-inicial.component.html',
  styleUrl: './vista-inicial.component.scss'
})
export class VistaInicialComponent {

}
