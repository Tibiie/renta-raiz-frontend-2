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

  elementsPerPage = 10;
  AreaMinima = '';
  AreaMaxima = '';
  filtrosSeleccionados: Map<string, any> = new Map();
  habitaciones: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  banos: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  parqueadero: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  estrato: number[] = [1, 2, 3, 4];

  // Para seleccionar
  seleccion = {
    habitaciones: [] as (number | string)[],
    banos: [] as (number | string)[],
    parqueadero: [] as (number | string)[],
    estrato: [] as number[],
  };

  categoriasInmuebles: any[] = [];
  resultados: any[] = [];

  // Para Tipo de Propiedad
  isPropertyDropdownOpen = false;
  selectedProperty: { code: string, name: string, displayName?: string } | null = null;
  propertyOptions: { code: string, name: string, displayName?: string }[] = [];

  // Para Inmueble
  isEstateDropdownOpen = false;
  selectedEstates: { code: string, name: string }[] = [];
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

  enviarFiltros() {
    this.prepararFiltros();
    const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);
    const obj = {
      ...filtrosObj,
      pages: 1,
    }
    console.log('Objeto a enviar:', obj);
    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        console.log("filtros", response.data);
        this.resultados = response.data;
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  prepararFiltros() {
    this.filtrosSeleccionados.clear();

    if (this.selectedProperty) {
      this.filtrosSeleccionados.set('biz', this.selectedProperty.code);
    }

    if (this.selectedEstates.length > 0) {
      const estateCodes = this.selectedEstates.map(e => e.code).join(',');
      this.filtrosSeleccionados.set('type', estateCodes);
    }

    if (this.seleccion.habitaciones.length > 0) {
      const values = this.seleccion.habitaciones;
      if (values.includes('+6')) {
        this.filtrosSeleccionados.set('"maxbedroom"', 100);
        this.filtrosSeleccionados.set('"minbedroom"', 6);
      } else {
        this.filtrosSeleccionados.set('"bedrooms"', values.join(','));
      }
    }

    if (this.seleccion.banos.length > 0) {
      const values = this.seleccion.banos;
      if (values.includes('+6')) {
        this.filtrosSeleccionados.set('"maxbathroom"', 100);
        this.filtrosSeleccionados.set('"minbathroom"', 6);
      } else {
        this.filtrosSeleccionados.set('"bathroom"', values.join(','));
      }
    }

    if (this.seleccion.parqueadero.length > 0) {
      const values = this.seleccion.parqueadero;
      if (values.includes('+6')) {
        this.filtrosSeleccionados.set('"maxparking"', 100);
        this.filtrosSeleccionados.set('"minparking"', 6);
      } else {
        this.filtrosSeleccionados.set('"maxparking"', values.join(','));
        this.filtrosSeleccionados.set('"minparking"', values.join(','));
      }
    }

    if (this.seleccion.estrato.length > 0) {
      this.filtrosSeleccionados.set('stratum', this.seleccion.estrato.join(','));
    }

    if (this.AreaMinima) {
      this.filtrosSeleccionados.set('"minarea"', this.AreaMinima);
    }

    if (this.AreaMaxima) {
      this.filtrosSeleccionados.set('"maxarea"', this.AreaMaxima);
    }
  }

  seleccionar(categoria: keyof typeof this.seleccion, valor: number | string) {
    if (categoria === 'estrato') {
      let arr = this.seleccion.estrato as number[];
      const index = arr.indexOf(valor as number);
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(valor as number);
      }
      this.seleccion.estrato = arr;
    } else {
      let arr = this.seleccion[categoria] as (number | string)[];
      const index = arr.indexOf(valor);
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(valor);
      }
      this.seleccion[categoria] = arr;
    }

    console.log('Selección actual:', this.seleccion);
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

  isEstateSelected(option: any): boolean {
    return this.selectedEstates.some(o => o.code === option.code);
  }

  getTipoPropiedad() {
    this.inmueblesService.getTipoPropiedad().subscribe(
      (response: any) => {
        this.estateOptions = response.data;
        console.log("tipoPropiedad", response.data);

        this.selectedEstates = this.estateOptions.length ? [this.estateOptions[0]] : [];
      },
      (error: any) => {
        console.error('Error al obtener los tipos de propiedad:', error);
      }
    );
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
      this.selectedProperty = this.selectedProperty?.code === option.code ? null : option;
      this.isPropertyDropdownOpen = false;
    }

    if (type === 'estate') {
      const index = this.selectedEstates.findIndex(o => o.code === option.code);
      if (index > -1) {
        // Ya está seleccionado → lo quitamos
        this.selectedEstates.splice(index, 1);
      } else {
        // No está seleccionado → lo agregamos
        this.selectedEstates.push(option);
      }
    }
  }

  getButtonClass(selected: boolean): string {
    const base = 'flex items-center px-3 py-2 text-sm rounded-md';
    return selected
      ? `${base} bg-[#080E36] text-white`
      : `${base} bg-blue-100 text-blue-700`;
  }
}
