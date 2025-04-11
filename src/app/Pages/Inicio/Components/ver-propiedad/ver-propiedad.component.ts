import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalCrearContactoComponent } from '../Modals/modal-crear-contacto/modal-crear-contacto.component';
import { MapaComponent } from "../mapa/mapa.component";

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
    MapaComponent
],
  templateUrl: './ver-propiedad.component.html',
  styleUrl: './ver-propiedad.component.scss',
})
export class VerPropiedadComponent implements OnInit {

  @ViewChild(ModalCrearContactoComponent) modalCrearContacto!: ModalCrearContactoComponent;

  codPro?: number;
  propiedad: any = {};
  thumbnailsPerPage = 3;
  selectedIndex: number = 0;
  visibleThumbnailsStart = 0;
  selectedImage: string = '';
  tabActivo: string = 'fotos';
  propiedades: any[] = [];
  // Injectaciones
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);
  inmueblesService = inject(InmueblesService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || window.history.state;

    this.route.paramMap.subscribe(params => {
      this.codPro = state?.codPro || Number(params.get('codpro'));
      console.log('CodPro:', this.codPro);
      this.getDatos();
    });
    
  }

  getDatos() {
    this.getDatosPropiedad();
  }

  seleccionarTab(tab: string) {
    this.tabActivo = tab;
  }

  getDatosPropiedad() {
    this.inmueblesService.getDatosPropiedad(this.codPro!).subscribe(
      (response: any) => {
        console.log('propiedad', response.data);
        this.propiedad = response.data;
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
    return this.propiedad?.images?.slice(this.visibleThumbnailsStart, this.visibleThumbnailsStart + this.thumbnailsPerPage) || [];
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

  openModalCrearContacto(codPro: number, accion: 'telefonos' | 'whatsapp' | 'soloEnviar') {
    console.log('codPro', codPro, 'accion', accion);
    this.modalCrearContacto.abrirModal(codPro, accion);
  }
}
