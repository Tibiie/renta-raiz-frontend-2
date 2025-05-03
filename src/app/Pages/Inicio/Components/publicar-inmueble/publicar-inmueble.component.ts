import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { BarraFiltrosComponent } from '../../../../shared/barra-filtros/barra-filtros.component';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';

@Component({
  selector: 'app-publicar-inmueble',
  standalone: true,
  imports: [
    NavbarComponent,
    BarraFiltrosComponent,
    BotonesFlotantesComponent,
    FooterComponent,
    ReactiveFormsModule
  ],
  templateUrl: './publicar-inmueble.component.html',
  styleUrl: './publicar-inmueble.component.scss',
})
export class PublicarInmuebleComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  inmuebleService = inject(InmueblesService);
  
  formPublicarInmueble = this.formBuilder.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    neighborhood: ['', Validators.required],
  });

  ngOnInit(): void {}

  crearPublicacionPropiedad() {
    if (!this.formPublicarInmueble.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Complete todos los campos',
        text: 'Estas enviando campos vacios o invalidos en el formulario!',
        draggable: false,
      });
      return;
    }

    const obj = {
      nombre: this.formPublicarInmueble.value.name,
      email: this.formPublicarInmueble.value.email,
      telefono: this.formPublicarInmueble.value.phone,
      mensaje: this.formPublicarInmueble.value.neighborhood,
    };

    // this.inmuebleService.createPublicacionPropiedad(obj).subscribe(
    //   (response: any) => {
    //     Swal.fire({
    //       icon: 'success',
    //       title: '¡Gracias!',
    //       text: 'Tu mensaje ha sido enviado con éxito!',
    //       draggable: true,
    //     });
    //   },
    //   (error: any) => {
    //     console.error('Error al enviar el contacto:', error);
    //   }
    // );
  }
}
