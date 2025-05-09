import { Component } from '@angular/core';

@Component({
  selector: 'app-envio-exitoso',
  standalone: true,
  imports: [],
  templateUrl: './envio-exitoso.component.html',
  styleUrl: './envio-exitoso.component.scss'
})
export class EnvioExitosoComponent {

  enviarWthatsapp() {
    window.open('https://api.whatsapp.com/send?phone=573145438665&fbclid=IwAR3QMKqSukr1caiTy37NVGvXSveu2ROlTUQZ1AQgJ7nr4dzz1FZOdH3rrwU', '_blank');
  }
}
