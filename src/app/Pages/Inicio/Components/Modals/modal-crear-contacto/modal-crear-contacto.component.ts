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
  iframeConfig: {
    [codPro: number]: {
      url: string;
      formId: string;
      formName: string;
      height?: number;
    }
  } = {
      5975: { url: 'https://api.leadconnectorhq.com/widget/form/DBQBxa2NZQgSAYMiukLJ', formId: 'DBQBxa2NZQgSAYMiukLJ', formName: 'Propiedad código 5975', height: 401 },
      2531: { url: 'https://api.leadconnectorhq.com/widget/form/M1injuZo8jl0AFnLbjzu', formId: 'M1injuZo8jl0AFnLbjzu', formName: 'Propiedad código 2531', height: 401 },
      5970: { url: 'https://api.leadconnectorhq.com/widget/form/XeOz8uDX43OxILBxg74S', formId: 'XeOz8uDX43OxILBxg74S', formName: 'Propiedad código 5970', height: 401 },
      2411: { url: 'https://api.leadconnectorhq.com/widget/form/5CmVcLxMiLpUTEImetKC', formId: '5CmVcLxMiLpUTEImetKC', formName: 'Propiedad código 2411', height: 401 },
      5689: { url: 'https://api.leadconnectorhq.com/widget/form/tanbgyswwkJ82IjFdrwz', formId: 'tanbgyswwkJ82IjFdrwz', formName: 'Lote en las Palmas (Yeferson Cossio)', height: 402 },
      5024: { url: 'https://api.leadconnectorhq.com/widget/form/1H6XwJGDZfAL1YuEcp0d', formId: '1H6XwJGDZfAL1YuEcp0d', formName: 'Propiedad código 5024', height: 401 }
    };

  iframeId = '';
  iframeTitle = '';
  iframeSrc: any = '';

  iframeHeight = 600;

  visible = false;
  isLoading = false;
  iframeListo = false;
  mostrarModalTelefonos = false;
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

    // const url = `${urlIframe}`;
    //this.urlBase = this.urlBase + "?urlInmueble="+

    // this.urlBase = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // console.log(this.urlBase);

    // "Magia" de Javascript para construir la Query String
    const params = new URLSearchParams();

    // Agregamos cada dato al objeto params
    // append(NOMBRE_EN_GHL, VALOR)
    params.append('urlInmueble', window.location.href);
    params.append('historial_web', "test");

    // Si tuvieras los datos del usuario logueado, los agregas también:
    // params.append('email', datosAEnviar.email);
    // params.append('full_name', datosAEnviar.full_name);

    // Construimos la URL final. toString() agrega automáticamente los & y ?
    const urlFinal = `${urlIframe}?${params.toString()}`;

    console.log('URL Generada:', urlFinal);

    this.urlBase = this.sanitizer.bypassSecurityTrustResourceUrl(urlFinal);

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

    let urlIframe = '';
    let formId = '';
    let formName = '';
    let iframeHeight = 600;

    const cfg = this.iframeConfig[codPro];
    if (cfg) {
      urlIframe = cfg.url;
      formId = cfg.formId;
      formName = cfg.formName;
      iframeHeight = cfg.height || 600;
    } else {
      const queryParams = this.activatedRoute.snapshot.queryParams;
      const utmSource = queryParams['utm_source'];

      if (utmSource === 'meta ads') {
        urlIframe = 'https://api.leadconnectorhq.com/widget/form/LArCYkvLIbfXbvaQMJ4Q';
      } else {
        urlIframe = 'https://api.leadconnectorhq.com/widget/form/9SRYMPh2FynzdxY045gg';
      }

      formId = urlIframe.split('/').pop() || 'default';
      formName = `Propiedad código ${codPro}`;
    }

    this.iframeId = `inline-${formId}`;
    this.iframeTitle = formName;
    this.iframeHeight = iframeHeight;

    const urlCurrent = window.location.href
    const encodedUrl = btoa(urlCurrent)
    const url = `${urlIframe}?urlInmueble=${encodedUrl}&historial_web=test`;

    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

  abrirToCall(number: string) {
    window.location.href = `tel:${number}`
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
