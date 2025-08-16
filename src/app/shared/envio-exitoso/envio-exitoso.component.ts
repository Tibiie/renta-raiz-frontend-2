import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-envio-exitoso',
  standalone: true,
  imports: [],
  templateUrl: './envio-exitoso.component.html',
  styleUrl: './envio-exitoso.component.scss'
})
export class EnvioExitosoComponent implements OnInit {


  router = inject(ActivatedRoute);

  ngOnInit(): void {
    setTimeout(() => {
      this.enviarWthatsapp();
    }, 5000);
  } enviarWthatsapp() {

    var param = this.router.snapshot.queryParamMap.get('urlInmueble');
    var text = `&text=Hola%2C%20Lenys%20me%20interesa%20este%20inmueble:%20${param}`;
    window.location.href = `https://api.whatsapp.com/send?phone=573145438665${text}`;
  }
}
