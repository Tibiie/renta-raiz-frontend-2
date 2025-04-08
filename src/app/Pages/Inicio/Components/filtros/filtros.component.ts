import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.scss'
})
export class FiltrosComponent implements OnInit {

  filtrosSeleccionados: Map<string, any> = new Map();
  habitaciones: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  banos: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  parqueadero: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  estrato: number[] = [1, 2, 3, 4, 5, 6];

  // Para seleccionar
  seleccion = {
    habitaciones: null as number | string | null,
    banos: null as number | string | null,
    parqueadero: null as number | string | null,
    estrato: null as number | null,
  };

  categoriasInmuebles: any[] = [];
  resultados: any[] = [];


  // Para Tipo de Propiedad
  isPropertyDropdownOpen = false;
  selectedProperty: { code: string, name: string, displayName?: string } | null = null;
  propertyOptions: { code: string, name: string, displayName?: string }[] = [];

  // Para Inmueble
  isEstateDropdownOpen = false;
  selectedEstate: { code: string, name: string } | null = null;
  estateOptions: { code: string, name: string }[] = [];

  private readonly icons = {
    property: {
      '': 'fas fa-list-ul',
      '1': 'fas fa-building',
      '2': 'fas fa-dollar-sign',
      '3': 'fas fa-home',
    } as Record<string, string>,
    estate: {
      '1': 'fas fa-building',
      '2': 'fas fa-home',
      '3': 'fas fa-home-user',
      '4': 'fas fa-store',
      '5': 'fas fa-warehouse',
      '6': 'fas fa-briefcase',
      '7': 'fas fa-map-marked-alt',
      '8': 'fas fa-tractor',
      '10': 'fas fa-home',
      '11': 'fas fa-car',
      '12': 'fas fa-umbrella-beach',
      '13': 'fas fa-store',
      '14': 'fas fa-home'
    } as Record<string, string>
  };

  constructor(
    private inmueblesService: InmueblesService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getDatos();

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state?.resultados) {
      console.log('Resultados recibidos:', state.resultados);
      this.resultados = state.resultados;
    } else {
      console.log('No se recibieron resultados.');
    }
  }

  getDatos() {
    this.getCategoriasInmuebles();
    this.getTipoPropiedad();
  }

  prepararFiltros() {
    this.filtrosSeleccionados.clear();

    if (this.selectedProperty) {
      this.filtrosSeleccionados.set('neighborhood', this.selectedProperty.code);
    }

    if (this.selectedEstate) {
      this.filtrosSeleccionados.set('type', this.selectedEstate.code);
    }

    if (this.seleccion.habitaciones) {
      this.filtrosSeleccionados.set('bedrooms', this.seleccion.habitaciones);
    }

    if (this.seleccion.banos) {
      this.filtrosSeleccionados.set('bathrooms', this.seleccion.banos);
    }

    if (this.seleccion.parqueadero) {
      this.filtrosSeleccionados.set('parqueadero', this.seleccion.parqueadero);
    }

    if (this.seleccion.estrato) {
      this.filtrosSeleccionados.set('stratum', this.seleccion.estrato);
    }
  }


  getCategoriasInmuebles() {
    this.inmueblesService.getCategoriasInmuebles().subscribe(
      (response: any) => {
        this.categoriasInmuebles = response.data;
        console.log("categorias", response.data);

        this.propertyOptions = response.data.map((cat: any) => {
          if (cat.code === '3') {
            return { ...cat, displayName: 'Todas' };
          }
          return cat;
        });

        const defaultOption = this.propertyOptions.find(cat => cat.code === '3') || this.propertyOptions[0];
        this.selectedProperty = defaultOption;
      },
      (error: any) => {
        console.error('Error al obtener las categorias:', error);
      }
    );
  }

  getTipoPropiedad() {
    this.inmueblesService.getTipoPropiedad().subscribe(
      (response: any) => {
        this.estateOptions = response.data;
        console.log("tipoPropiedad", response.data);

        this.selectedEstate = this.estateOptions[0] || null;
      },
      (error: any) => {
        console.error('Error al obtener los tipos de propiedad:', error);
      }
    );
  }

  seleccionar(categoria: keyof typeof this.seleccion, valor: number | string) {
    if (categoria === 'estrato') {
      if (typeof valor !== 'number') return;

      this.seleccion[categoria] =
        this.seleccion[categoria] === valor ? null : valor;
    } else {
      this.seleccion[categoria] =
        this.seleccion[categoria] === valor ? null : valor;
    }

    console.log('Selección actual:', this.seleccion);
  }


  getIcon(type: 'property' | 'estate', option: any): string {
    if (type === 'property') {
      if (!option) return 'fas fa-list-ul';
      const code = typeof option === 'object' ? option.code : '';
      return this.icons.property[code] || 'fas fa-home';
    }
    else {
      const code = typeof option === 'object' ? option.code : '';
      return this.icons.estate[code] || 'fas fa-question-circle';
    }
  }

  toggleDropdown(type: 'property' | 'estate'): void {
    if (type === 'property') {
      this.isPropertyDropdownOpen = !this.isPropertyDropdownOpen;
      this.isEstateDropdownOpen = false;
    } if (type === 'estate') {
      this.isEstateDropdownOpen = !this.isEstateDropdownOpen;
      this.isPropertyDropdownOpen = false;
    }
  }

  selectOption(
    type: 'property' | 'estate' | 'project',
    option: any
  ): void {
    if (type === 'property') {
      this.selectedProperty = option;
      this.isPropertyDropdownOpen = false;
    } if (type === 'estate') {
      this.selectedEstate = option;
      this.isEstateDropdownOpen = false;
    }
  }

  getButtonClass(selected: boolean): string {
    const base = 'flex items-center px-3 py-2 text-sm rounded-md';
    return selected
      ? `${base} bg-[#080E36] text-white`
      : `${base} bg-blue-100 text-blue-700`;
  }
}
