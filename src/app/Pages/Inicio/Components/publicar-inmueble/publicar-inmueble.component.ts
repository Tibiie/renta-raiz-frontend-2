import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { BarraFiltrosComponent } from '../../../../shared/barra-filtros/barra-filtros.component';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { VolverComponent } from "../../../../shared/volver/volver.component";

@Component({
  selector: 'app-publicar-inmueble',
  standalone: true,
  imports: [
    NavbarComponent,
    BarraFiltrosComponent,
    BotonesFlotantesComponent,
    FooterComponent,
    ReactiveFormsModule,
    CommonModule,
    VolverComponent
  ],
  templateUrl: './publicar-inmueble.component.html',
  styleUrl: './publicar-inmueble.component.scss',
})
export class PublicarInmuebleComponent implements OnInit {
  cargando = false;
  fotosBase64: string[] = [];
  
  toastr = inject(ToastrService);
  formBuilder = inject(FormBuilder);
  inmuebleService = inject(InmueblesService);
  
  formPublicarInmueble = this.formBuilder.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['', Validators.required],
    barrio: ['', Validators.required],
  });
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  crearPublicacionPropiedad() {
    if (!this.formPublicarInmueble.valid) {
      this.toastr.error('Complete todos los campos', 'Error', {
        closeButton: true,
        positionClass: "toast-bottom-right",
        progressBar: true,
        timeOut: 5000,
      });
      return;
    }

    this.cargando = true;

    const obj = {
      nombre: this.formPublicarInmueble.get('nombre')?.value,
      email: this.formPublicarInmueble.get('email')?.value,
      telefono: this.formPublicarInmueble.get('telefono')?.value,
      barrio: this.formPublicarInmueble.get('barrio')?.value,
      fechaSolicitud: Date.now(),
      fotosInmuebles: this.fotosBase64
    };

    console.log(obj);

    this.inmuebleService.publicarInmueble(obj).subscribe(
      (response: any) => {
        this.formPublicarInmueble.reset();
        this.fotosBase64 = [];
        this.toastr.success('¡Gracias!', 'Tu solicitud ha sido enviada con éxito!', {
          closeButton: true,
          positionClass: "toast-bottom-right",
          progressBar: true,
          timeOut: 5000,
        });

        this.cargando = false;
      },
      (error: any) => {
        console.error('Error al enviar el contacto:', error);
      }
    );
  }

  handleFileInput(event: any) {
    const files: FileList = event.target.files;

    if (files.length > 5) {
      this.toastr.warning('Solo puedes adjuntar hasta 5 fotos.', 'Máximo 5 imágenes', {
        closeButton: true,
        positionClass: "toast-bottom-right",
        progressBar: true,
        timeOut: 5000,
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
}
