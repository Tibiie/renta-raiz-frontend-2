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
  }

  enviarWthatsapp() {
    const param = this.router.snapshot.queryParamMap.get('urlInmueble');
    const text = `&text=Hola%2C%20Lenys%20estoy%20interesado%20en:%20${param}`;
    window.location.href = `https://api.whatsapp.com/send?phone=573145438665${text}`;
  }
}
