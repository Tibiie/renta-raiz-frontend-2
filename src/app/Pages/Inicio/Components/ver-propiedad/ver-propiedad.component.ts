import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-propiedad',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './ver-propiedad.component.html',
  styleUrl: './ver-propiedad.component.scss'
})
export class VerPropiedadComponent implements OnInit {

  codPro?: number;
  propiedad: any = {};

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private inmueblesService: InmueblesService,
  ) {
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state?.codPro) {
      this.codPro = state.codPro;
    }
    console.log('CodPro:', this.codPro);
    this.cdRef.detectChanges();

    this.getDatos();
  }

  getDatos() {
    this.getDatosPropiedad();
  }

  getDatosPropiedad() {
    this.inmueblesService.getDatosPropiedad(this.codPro!).subscribe(
      (response: any) => {
        console.log("propiedad", response.data);
        this.propiedad = response.data;
      },
      (error: any) => {
        console.error('Error al obtener la propiedad:', error);
      }
    );
  }
}
