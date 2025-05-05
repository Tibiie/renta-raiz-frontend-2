import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { BarraFiltrosComponent } from '../../../../shared/barra-filtros/barra-filtros.component';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { log } from 'node:console';

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
  ciudades: any[] = [];
  fotosBase64: string[] = [];

  formBuilder = inject(FormBuilder);
  inmuebleService = inject(InmueblesService);

  formPublicarInmueble = this.formBuilder.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['', Validators.required],
    barrio: ['', Validators.required],
  });

  ngOnInit(): void {
    this.getCiudadesBarrios();
  }

  getCiudadesBarrios() {
    this.inmuebleService.getBarrios().subscribe(
      (response: any) => {
        this.ciudades = response.data;
        console.log(this.ciudades);
      },
      (error: any) => {
        console.error('Error al obtener las ciudades:', error);
      }
    );
  }

  handleFileInput(event: any) {
    const files: FileList = event.target.files;

    if (files.length > 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Máximo 5 imágenes',
        text: 'Solo puedes adjuntar hasta 5 fotos.',
      });
      return;
    }

    this.fotosBase64 = [];

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;
        this.fotosBase64.push(base64);
      };

      reader.readAsDataURL(file);
    });
  }

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
      nombre: this.formPublicarInmueble.get('nombre')?.value,
      email: this.formPublicarInmueble.get('email')?.value,
      telefono: this.formPublicarInmueble.get('telefono')?.value,
      barrio: this.formPublicarInmueble.get('barrio')?.value,
      fotosInmueble: this.fotosBase64
    };

    console.log(obj);

    this.inmuebleService.publicarInmueble(obj).subscribe(
      (response: any) => {
        this.formPublicarInmueble.reset();
        Swal.fire({
          icon: 'success',
          title: '¡Gracias!',
          text: 'Tu solicitud ha sido enviada con éxito!',
          draggable: true,
        });
      },
      (error: any) => {
        console.error('Error al enviar el contacto:', error);
      }
    );
  }
}
