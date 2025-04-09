import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './contactanos.component.html',
  styleUrl: './contactanos.component.scss'
})
export class ContactanosComponent {

   email = "info@rentaraiz.com"

}
