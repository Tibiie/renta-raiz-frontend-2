import { Component, inject, Inject } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, ReactiveFormsModule],
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
    const obj = {
      nombre: this.formContacto.get('nombre')?.value,
      email: this.formContacto.get('email')?.value,
      telefono: this.formContacto.get('telefono')?.value,
      mensaje: this.formContacto.get('mensaje')?.value,
      fuente: 'contactanos',
    };
    console.log('Objeto a enviar:', obj);
    this.inmueblesService.createContacto(obj).subscribe(
      (response: any) => {
        console.log("contacto", response);
        this.vaciarFormulario();
        this.mostrarAlerta = true;

        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 4000);
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
