import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { InmueblesService } from '../../../../../core/Inmuebles/inmuebles.service';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-crear-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-crear-contacto.component.html',
  styleUrl: './modal-crear-contacto.component.scss'
})
export class ModalCrearContactoComponent implements OnInit {


  visible = false;
  isLoading = false;
  iframeListo = false;
  mostrarModalTelefonos = false;
  private contactoEnviadoPorCodPro: { [codPro: number]: boolean } = {};

  codPro?: number;
  fuente?: string;
  accion: 'telefonos' | 'whatsapp' | 'soloEnviar' = 'soloEnviar';

 
  urlBase!: SafeResourceUrl;



  
  toastr = inject(ToastrService);
  fb = inject(NonNullableFormBuilder);
  inmuebleService = inject(InmueblesService);
  location = inject(Location);
  sanitizer = inject(DomSanitizer);

  contacto = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', Validators.required],
    telefono: ['', Validators.required],
    cedula: ['', Validators.required],
    mensaje: ['', Validators.required],
  });



  ngOnInit(): void {
    const url = `https://api.leadconnectorhq.com/widget/form/9SRYMPh2FynzdxY045gg?urlInmueble=${window.location.href}`;
    //this.urlBase = this.urlBase + "?urlInmueble="+ 

    this.urlBase = this.sanitizer.bypassSecurityTrustResourceUrl(url);
   console.log(this.urlBase);
   
  }
     

  abrirModal(codPro: number, accion: 'telefonos' | 'whatsapp' | 'soloEnviar') {
    this.codPro = codPro;
    this.accion = accion;

    const yaEnviado = this.contactoEnviadoPorCodPro[codPro];

    if (accion === 'telefonos' && yaEnviado) {
      this.abrirModalTelefonos();
      return;
    }

    this.visible = true;

    setTimeout(() => {
      const iframe = document.getElementById('formIframe');
      const container = document.getElementById('iframe-container');

      if (iframe && container && !container.contains(iframe)) {
        container.appendChild(iframe);
        iframe.style.display = 'block';
      }
    }, 0);
  }

  cerrarModal() {
    this.visible = false;

    const iframe = document.getElementById('formIframe');
    const wrapper = document.getElementById('iframe-wrapper');

    if (iframe && wrapper) {
      wrapper.appendChild(iframe);
      iframe.style.display = 'none';
    }
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
      this.toastr.error('Complete todos los campos', 'Error', {
        closeButton: true,
        progressBar: true,
        timeOut: 5000,
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
          this.toastr.success('¡Gracias!', 'Tu mensaje ha sido enviado con éxito!', {
            closeButton: true,
            progressBar: true,
            timeOut: 5000,
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
