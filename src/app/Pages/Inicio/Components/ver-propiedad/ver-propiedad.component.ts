import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { NavbarComponent2 } from '../../../../shared/navbar-2/navbar-2.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalCrearContactoComponent } from '../Modals/modal-crear-contacto/modal-crear-contacto.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { MapaComponent } from '../mapa/mapa.component';
import mediumZoom from 'medium-zoom';
import { log } from 'console';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';
import { VolverComponent } from '../../../../shared/volver/volver.component';

@Component({
  selector: 'app-ver-propiedad',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ModalCrearContactoComponent,
    FooterComponent,
    BotonesFlotantesComponent,
    VolverComponent,
    NavbarComponent2
],
  templateUrl: './ver-propiedad.component.html',
  styleUrl: './ver-propiedad.component.scss',
})
export class VerPropiedadComponent implements OnInit {
  @ViewChild(ModalCrearContactoComponent)
  modalCrearContacto!: ModalCrearContactoComponent;

  codPro?: number;
  selectedIndex = 0;
  propiedad: any = {};
  elementsPerPage = 3;
  thumbnailsPerPage = 3;
  resultadosFiltros: any[] = [];
  selectedImageUrl: string | null = null;

  isModalOpen = false;
  datosCargados = false;
  mostrarContenido = false;

  filtrosSeleccionados: Map<string, any> = new Map();

  private currentScale = 1;
  private zoomInstance: any;
  private isZoomActive = false;

  visibleThumbnailsStart = 0;
  selectedImage: string = '';
  tabActivo: string = 'fotos';

  router = inject(Router);
  route = inject(ActivatedRoute);
  cdRef = inject(ChangeDetectorRef);
  inmueblesService = inject(InmueblesService);

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initZoom();

    this.route.paramMap.subscribe((params) => {
      this.codPro = Number(params.get('codpro'));
      const ocultar = Number(params.get('ocultarContenido')) === 1;

      this.mostrarContenido = !ocultar;  

      this.getDatos();
    });
  }

  getDatos() {
    this.getDatosPropiedad();
    this.prepararFiltros();
  }

  openModal(index: number): void {
    this.selectedIndex = index;
    this.isModalOpen = true;
    setTimeout(() => {
      this.initZoom();
    }, 100);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.destroyZoom();
  }

  initZoom(): void {
    this.destroyZoom();

    const images = document.querySelectorAll('[data-zoom-src]');
    this.zoomInstance = mediumZoom(images, {
      background: 'rgba(0, 0, 0, 0.9)',
      margin: 24,
      scrollOffset: 40,
      template: '#zoom-template',
    });

    this.zoomInstance.on('open', () => {
      this.isZoomActive = true;
    });

    this.zoomInstance.on('close', () => {
      this.isZoomActive = false;
      this.currentScale = 1;
    });
  }

  destroyZoom(): void {
    if (this.zoomInstance) {
      this.zoomInstance.detach();
      this.zoomInstance = null;
    }
    this.isZoomActive = false;
    this.currentScale = 1;
  }

  handleImageClick(event: Event): void {
    if (this.isZoomActive) {
      event.stopPropagation();
    }
  }

  prevImageM(): void {
    this.selectedIndex =
      (this.selectedIndex - 1 + this.propiedad.images.length) %
      this.propiedad.images.length;
    this.resetZoom();
    this.reinitZoom();
  }

  nextImageM(): void {
    this.selectedIndex =
      (this.selectedIndex + 1) % this.propiedad.images.length;
    this.resetZoom();
    this.reinitZoom();
  }

  goToImage(index: number): void {
    this.selectedIndex = index;
    this.resetZoom();
    this.reinitZoom();
  }

  reinitZoom(): void {
    setTimeout(() => {
      this.initZoom();
    }, 50);
  }

  zoomIn(): void {
    if (!this.zoomInstance) return;

    const img = this.getCurrentImage();
    if (img) {
      this.currentScale = Math.min(this.currentScale + 0.25, 3);
      img.style.transform = `scale(${this.currentScale})`;
      img.style.cursor = 'grab';
    }
  }

  zoomOut(): void {
    if (!this.zoomInstance) return;

    const img = this.getCurrentImage();
    if (img) {
      this.currentScale = Math.max(this.currentScale - 0.25, 1);
      img.style.transform = `scale(${this.currentScale})`;
      if (this.currentScale === 1) {
        img.style.cursor = 'zoom-in';
      }
    }
  }

  resetZoom(): void {
    const img = this.getCurrentImage();
    if (img) {
      this.currentScale = 1;
      img.style.transform = 'scale(1)';
      img.style.cursor = 'zoom-in';
    }
    if (this.zoomInstance) {
      this.zoomInstance.close();
    }
  }

  private getCurrentImage(): HTMLElement | null {
    return document.querySelector(
      `[data-zoom-src="${this.propiedad.images[this.selectedIndex]?.imageurl}"]`
    );
  }

  ngOnDestroy(): void {
    this.destroyZoom();
  }

  seleccionarTab(tab: string) {
    this.tabActivo = tab;
  }

  getDatosPropiedad() {
    this.datosCargados = false;

    this.inmueblesService.getDatosPropiedad(this.codPro!).subscribe(
      (response: any) => {
        this.propiedad = response.data;

        this.datosCargados = true;

        this.prepararFiltros();
        this.enviarFiltros();
      },
      (error: any) => {
        console.error('Error al obtener la propiedad:', error);
        this.datosCargados = true;
      }
    );
  }


  selectImage(index: number) {
    this.selectedIndex = index;
  }
  prevImage() {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.propiedad.images.length - 1;
    } else {
      this.selectedIndex--;
    }
  }

  nextImage() {
    if (this.selectedIndex === this.propiedad.images.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
  }

  get visibleThumbnails() {
    return (
      this.propiedad?.images?.slice(
        this.visibleThumbnailsStart,
        this.visibleThumbnailsStart + this.thumbnailsPerPage
      ) || []
    );
  }

  prevThumbs() {
    if (this.visibleThumbnailsStart > 0) {
      this.visibleThumbnailsStart -= this.thumbnailsPerPage;
    }
  }

  nextThumbs() {
    const maxStart = this.propiedad.images.length - this.thumbnailsPerPage;
    if (this.visibleThumbnailsStart < maxStart) {
      this.visibleThumbnailsStart += this.thumbnailsPerPage;
    }
  }

  openModalCrearContacto(
    codPro: number,
    accion: 'telefonos' | 'whatsapp' | 'soloEnviar'
  ) {
    this.modalCrearContacto.abrirModal(codPro, accion);
  }

  prepararFiltros() {
    this.filtrosSeleccionados.clear();
    this.filtrosSeleccionados.set('city', this.propiedad.city_code);
    if (this.propiedad.biz_code == 1) {
      this.filtrosSeleccionados.set('pcmin', this.propiedad.rent);
    }

    if (this.propiedad.biz_code == 2) {
      this.filtrosSeleccionados.set('pvmin', this.propiedad.saleprice);
    }

    if (this.propiedad.biz_code == 3) {
      this.filtrosSeleccionados.set('pcmin', this.propiedad.rent);
      this.filtrosSeleccionados.set('pvmin', this.propiedad.saleprice);
    }
  }

  enviarFiltros() {
    const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);

    console.log(filtrosObj);

    const obj = { ...filtrosObj, page: 1 };

    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        const idActual = this.propiedad.idpro;
        let filtrados = response.data.filter(
          (inmueble: any) => inmueble.idpro !== idActual
        );

        const faltantes = 3 - filtrados.length;
        if (faltantes > 0) {
          this.inmueblesService
            .getFiltrosEnviar(
              { ...filtrosObj, page: obj.page + 1 },
              this.elementsPerPage
            )
            .subscribe((respuestaSiguiente: any) => {
              filtrados.push(...respuestaSiguiente.data.slice(0, faltantes));
              this.resultadosFiltros = filtrados;
            });
        } else {
          this.resultadosFiltros = filtrados;
        }
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  verPropiedad(codPro: number) {
    this.router
      .navigate(['/ver-propiedad', codPro, 0])
      .then(() => {
        window.scrollTo(0, 0);
      });
  }

  enviarFiltrosMigajas(tipo: string, value: string) {


   

     const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);
     const obj = {
      ...filtrosObj,
      sort: 'desc',
      order: 'consignation_date',
      page: 1,
    };

     this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        this.router.navigate(['/filtros'], {
          state: {
            resultados: response.data,
            paginacion: response,
            filtros: obj,
          },
        });
 
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );

  }
}
