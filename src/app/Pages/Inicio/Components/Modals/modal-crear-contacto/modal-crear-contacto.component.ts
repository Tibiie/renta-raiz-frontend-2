import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InmueblesService } from '../../../../../core/Inmuebles/inmuebles.service';
import { FormBuilder, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-crear-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-crear-contacto.component.html',
  styleUrl: './modal-crear-contacto.component.scss'
})
export class ModalCrearContactoComponent {

  visible = false;
  isLoading = false;
  mostrarModalTelefonos = false;
  private contactoEnviadoPorCodPro: { [codPro: number]: boolean } = {};

  codPro?: number;
  fuente?: string;
  accion: 'telefonos' | 'whatsapp' | 'soloEnviar' = 'soloEnviar';

  fb = inject(NonNullableFormBuilder);
  inmuebleService = inject(InmueblesService);

  contacto = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', Validators.required],
    telefono: ['', Validators.required],
    cedula: ['', Validators.required],
    mensaje: ['', Validators.required],
  });

  abrirModal(codPro: number, accion: 'telefonos' | 'whatsapp' | 'soloEnviar') {
    this.codPro = codPro;
    this.accion = accion;

    const yaEnviado = this.contactoEnviadoPorCodPro[codPro];

    if (accion === 'telefonos' && yaEnviado) {
      this.abrirModalTelefonos();
      return;
    }

    this.visible = true;
  }

  cerrarModal() {
    this.visible = false;
  }

  abrirModalTelefonos() {
    this.mostrarModalTelefonos = true;
  }

  cerrarModalTelefonos() {
    this.mostrarModalTelefonos = false;
  }

  enviarContacto() {
    this.isLoading = true;

    if (!this.contacto.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Complete todos los campos',
        text: 'Estas enviando campos vacios o invalidos en el formulario!',
        draggable: false,
      });
      return;
    }

    const obj = {
      nombre: this.contacto.value.nombre,
      email: this.contacto.value.email,
      telefono: this.contacto.value.telefono,
      cedula: this.contacto.value.cedula,
      mensaje: this.contacto.value.mensaje,
      codPro: this.codPro,
      fuente: 'propiedad',
    };

    this.inmuebleService.createContacto(obj).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.cerrarModal();

        if (this.accion === 'whatsapp') {
          this.abrirPestana(`https://api.whatsapp.com/send?phone=${this.contacto.value.telefono}&text=${this.contacto.value.mensaje}`);
        }

        if (this.accion === 'soloEnviar') {
          Swal.fire({
            icon: 'success',
            title: '¡Gracias!',
            text: 'Tu mensaje ha sido enviado con éxito!',
            draggable: true,
          });
          return;
        }

        if (this.accion === 'telefonos') {
          this.contactoEnviadoPorCodPro[this.codPro!] = true;
          this.abrirModalTelefonos();
        }

      },
      (error: any) => {
        console.error('Error al enviar el contacto:', error);
        this.isLoading = false;
      }
    );
  }

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }
}
