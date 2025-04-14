import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalCrearContactoComponent } from '../Modals/modal-crear-contacto/modal-crear-contacto.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { MapaComponent } from '../mapa/mapa.component';
import mediumZoom from 'medium-zoom';
import { log } from 'console';

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
    MapaComponent,
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
  isModalOpen = false;
  elementsPerPage = 3;
  thumbnailsPerPage = 3;
  selectedImageUrl: string | null = null;
  resultadosFiltros: any[] = [];
  filtrosSeleccionados: Map<string, any> = new Map();

  private isZoomActive = false;
  private zoomInstance: any;
  private currentScale = 1;

  visibleThumbnailsStart = 0;
  selectedImage: string = '';
  tabActivo: string = 'fotos';

  // Injectaciones
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);
  inmueblesService = inject(InmueblesService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.initZoom();
    this.route.paramMap.subscribe((params) => {
      this.codPro = Number(params.get('codpro'));
      console.log('CodPro:', this.codPro);
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

    // Esperamos a que el modal se renderice completamente
    setTimeout(() => {
      this.initZoom();
    }, 100);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.destroyZoom();
  }

  initZoom(): void {
    this.destroyZoom(); // Limpiamos cualquier instancia previa

    const images = document.querySelectorAll('[data-zoom-src]');
    this.zoomInstance = mediumZoom(images, {
      background: 'rgba(0, 0, 0, 0.9)',
      margin: 24,
      scrollOffset: 40,
      template: '#zoom-template'
    });

    // Manejar eventos de zoom
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
    this.selectedIndex = (this.selectedIndex - 1 + this.propiedad.images.length) % this.propiedad.images.length;
    this.resetZoom();
    this.reinitZoom();
  }

  nextImageM(): void {
    this.selectedIndex = (this.selectedIndex + 1) % this.propiedad.images.length;
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
    return document.querySelector(`[data-zoom-src="${this.propiedad.images[this.selectedIndex]?.imageurl}"]`);
  }

  ngOnDestroy(): void {
    this.destroyZoom();
  }

  seleccionarTab(tab: string) {
    this.tabActivo = tab;
  }

  getDatosPropiedad() {
    this.inmueblesService.getDatosPropiedad(this.codPro!).subscribe(
      (response: any) => {
        console.log('propiedad', response.data);
        this.propiedad = response.data;
        this.prepararFiltros();
        this.enviarFiltros()
      },
      (error: any) => {
        console.error('Error al obtener la propiedad:', error);
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
    console.log('codPro', codPro, 'accion', accion);
    this.modalCrearContacto.abrirModal(codPro, accion);
  }

  prepararFiltros() {
    this.filtrosSeleccionados.clear();
    this.filtrosSeleccionados.set('city', this.propiedad.city_code);
    this.filtrosSeleccionados.set('biz', this.propiedad.biz_code);

    console.log('Filtros:', this.filtrosSeleccionados);
  }

  enviarFiltros() {
    const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);
    const obj = { ...filtrosObj, page: 1 };
    console.log('Objeto a enviar:', obj);

    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        const idActual = this.propiedad.idpro;
        let filtrados = response.data.filter((inmueble: any) => inmueble.idpro !== idActual);

        const faltantes = 3 - filtrados.length;
        if (faltantes > 0) {
          this.inmueblesService.getFiltrosEnviar({ ...filtrosObj, page: obj.page + 1 }, this.elementsPerPage)
            .subscribe((respuestaSiguiente: any) => {
              filtrados.push(...respuestaSiguiente.data.slice(0, faltantes));
              this.resultadosFiltros = filtrados;
              console.log("Inmuebles completos:", this.resultadosFiltros);
            });
        } else {
          this.resultadosFiltros = filtrados;
          console.log("Inmuebles completos:", this.resultadosFiltros);
        }
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  verPropiedad(codPro: number) {
    this.router.navigate(['/ver-propiedad', codPro]);
  }
}
