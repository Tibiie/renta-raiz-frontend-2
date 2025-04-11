import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-propiedad',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './ver-propiedad.component.html',
  styleUrl: './ver-propiedad.component.scss',
})
export class VerPropiedadComponent implements OnInit {
  codPro?: number;
  propiedad: any = {};
  selectedIndex: number = 0;
  selectedImage: string = '';
  tabActivo: string = 'fotos';

  // Injectaciones
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);
  inmueblesService = inject(InmueblesService);

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state =
      navigation?.extras?.state ||
      (typeof window !== 'undefined' ? window.history.state : null);

    if (state?.codPro) {
      this.codPro = state.codPro;
    }
    console.log('CodPro:', this.codPro);

    this.getDatos();
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
}
