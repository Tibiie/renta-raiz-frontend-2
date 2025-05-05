import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BotonesFlotantesComponent } from "../../../../shared/botones-flotantes/botones-flotantes.component";
import { FooterComponent } from "../../../../shared/footer/footer.component";
import { BarraFiltrosComponent } from "../../../../shared/barra-filtros/barra-filtros.component";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, ReactiveFormsModule, BotonesFlotantesComponent, FooterComponent, BarraFiltrosComponent],
  templateUrl: './contactanos.component.html',
  styleUrl: './contactanos.component.scss'
})
export class ContactanosComponent {

  mostrarAlerta: boolean = false;

  email = "info@rentaraiz.com";

  // Injeccciones
  toastr = inject(ToastrService);
  formBuilder = inject(FormBuilder);
  inmueblesService = inject(InmueblesService);

  // Formularios
  formContacto = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });

  createContacto() {
    if (this.formContacto.invalid) {
      this.toastr.error('Complete todos los campos', 'Error', {
        closeButton: true,
        positionClass: "toast-bottom-right",
        progressBar: true,
        timeOut: 5000,
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
        this.toastr.success('¡Gracias!', 'Tu mensaje ha sido enviado con éxito!', {
          closeButton: true,
          positionClass: "toast-bottom-right",
          progressBar: true,
          timeOut: 5000,
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
