import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { InmueblesService } from '../../../../../core/Inmuebles/inmuebles.service';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-crear-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-crear-contacto.component.html',
  styleUrl: './modal-crear-contacto.component.scss',
})
export class ModalCrearContactoComponent implements OnInit {
  iframeEspecial: { [codPro: number]: any } = {
    5975: {
      src: 'https://api.leadconnectorhq.com/widget/form/DBQBxa2NZQgSAYMiukLJ',
      id: 'inline-DBQBxa2NZQgSAYMiukLJ',
      formId: 'DBQBxa2NZQgSAYMiukLJ',
      title: 'Propiedad código 5975',
      height: '401'
    },
    2531: {
      src: 'https://api.leadconnectorhq.com/widget/form/M1injuZo8jl0AFnLbjzu',
      id: 'inline-M1injuZo8jl0AFnLbjzu',
      formId: 'M1injuZo8jl0AFnLbjzu',
      title: 'Propiedad código 2531',
      height: '401'
    },
    5970: {
      src: 'https://api.leadconnectorhq.com/widget/form/XeOz8uDX43OxILBxg74S',
      id: 'inline-XeOz8uDX43OxILBxg74S',
      formId: 'XeOz8uDX43OxILBxg74S',
      title: 'Propiedad código 5970',
      height: '401'
    },
    2411: {
      src: 'https://api.leadconnectorhq.com/widget/form/5CmVcLxMiLpUTEImetKC',
      id: 'inline-5CmVcLxMiLpUTEImetKC',
      formId: '5CmVcLxMiLpUTEImetKC',
      title: 'Propiedad código 2411',
      height: '401'
    },
    5689: {
      src: 'https://api.leadconnectorhq.com/widget/form/tanbgyswwkJ82IjFdrwz',
      id: 'inline-tanbgyswwkJ82IjFdrwz',
      formId: 'tanbgyswwkJ82IjFdrwz',
      title: 'Lote en las Palmas (Yeferson Cossio)',
      height: '402'
    },
  };

  iframeActual: any = null;
  usarIframeEspecial: boolean = false;
  
  visible = false;
  isLoading = false;
  iframeListo = false;
  mostrarModalTelefonos = false;
  public urlActual: string = window.location.href;
  private contactoEnviadoPorCodPro: { [codPro: number]: boolean } = {};

  codPro?: number;
  fuente?: string;
  accion: 'telefonos' | 'whatsapp' | 'soloEnviar' = 'soloEnviar';
  utm_source = '';

  urlBase!: SafeResourceUrl;

  toastr = inject(ToastrService);
  fb = inject(NonNullableFormBuilder);
  inmuebleService = inject(InmueblesService);
  location = inject(Location);
  sanitizer = inject(DomSanitizer);
  activatedRoute = inject(ActivatedRoute);

  contacto = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', Validators.required],
    telefono: ['', Validators.required],
    cedula: ['', Validators.required],
    mensaje: ['', Validators.required],
  });

  ngOnInit(): void {
    var queryParams = this.activatedRoute.snapshot.queryParams;
    console.log(queryParams);

    var urlIframe = '';

    if (
      queryParams['utm_source'] != undefined ||
      queryParams['utm_source'] != null
    ) {
      console.log(queryParams['utm_source']);

      switch (queryParams['utm_source']) {
        case 'meta ads':
          urlIframe =
            'https://api.leadconnectorhq.com/widget/form/LArCYkvLIbfXbvaQMJ4Q';
          break;

        default:
          urlIframe =
            'https://api.leadconnectorhq.com/widget/form/9SRYMPh2FynzdxY045gg';
          break;
      }
    } else {
      urlIframe =
        'https://api.leadconnectorhq.com/widget/form/9SRYMPh2FynzdxY045gg';
    }

    const url = `${urlIframe}?urlInmueble=${window.location.href}`;
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
  this.usarIframeEspecial = false;

  if (this.iframeEspecial[codPro]) {
    this.iframeActual = this.iframeEspecial[codPro];
    this.usarIframeEspecial = true;
  } else {
    const urlBase = this.getIframePorUTM() + '?urlInmueble=' + window.location.href;
    this.urlBase = this.sanitizer.bypassSecurityTrustResourceUrl(urlBase);
  }

  setTimeout(() => {
    const iframe = document.getElementById('formIframe');
    const container = document.getElementById('iframe-container');
    if (iframe && container && !container.contains(iframe)) {
      container.appendChild(iframe);
      iframe.style.display = 'block';
    }
  }, 0);
}

getIframePorUTM(): string {
  const queryParams = this.activatedRoute.snapshot.queryParams;
  const utmSource = queryParams['utm_source'];
  if (utmSource === 'meta ads') {
    return 'https://api.leadconnectorhq.com/widget/form/LArCYkvLIbfXbvaQMJ4Q';
  }
  return 'https://api.leadconnectorhq.com/widget/form/9SRYMPh2FynzdxY045gg';
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
          this.abrirPestana(
            `https://api.whatsapp.com/send?phone=${this.contacto.value.telefono}&text=${this.contacto.value.mensaje}`
          );
        }

        if (this.accion === 'soloEnviar') {
          this.toastr.success(
            '¡Gracias!',
            'Tu mensaje ha sido enviado con éxito!',
            {
              closeButton: true,
              progressBar: true,
              timeOut: 5000,
            }
          );
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
