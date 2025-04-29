import { Component, inject, Inject } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BotonesFlotantesComponent } from "../../../../shared/botones-flotantes/botones-flotantes.component";
import { FooterComponent } from "../../../../shared/footer/footer.component";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, ReactiveFormsModule, BotonesFlotantesComponent, FooterComponent],
  templateUrl: './contactanos.component.html',
  styleUrl: './contactanos.component.scss'
})
export class ContactanosComponent {

  mostrarAlerta: boolean = false;

  email = "info@rentaraiz.com";

  // Injeccciones
  inmueblesService = inject(InmueblesService);
  formBuilder = inject(FormBuilder);

  // Formularios
  formContacto = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });

  createContacto() {
    if (this.formContacto.invalid) {
      Swal.fire({
        icon: "error",
        title: "Complete todos los campos",
        text: "Estas enviando campos vacios o invalidos en el formulario!",
        draggable: false,
      });
      return;
    }

    const obj = {
      nombre: this.formContacto.get('nombre')?.value,
      email: this.formContacto.get('email')?.value,
      telefono: this.formContacto.get('telefono')?.value,
      mensaje: this.formContacto.get('mensaje')?.value,
      fuente: 'contactanos',
    };
    this.inmueblesService.createContacto(obj).subscribe(
      (response: any) => {
        this.vaciarFormulario();
        Swal.fire({
          icon: "success",
          title: "¡Gracias!",
          text: "Tu mensaje ha sido enviado con éxito!",
          draggable: true,
        });
      },
      (error: any) => {
        console.error('Error al enviar el contacto:', error);
      }
    );
  }

  vaciarFormulario() {
    this.formContacto.reset();
  }

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }
}
