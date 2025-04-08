import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type PropertyOption = 'Todas' | 'Ventas' | 'Airbnb' | 'Arriendos';
type EstateOption =
  | 'Todas'
  | 'Amoblados'
  | 'Apartaestudios'
  | 'Apartamentos'
  | 'Casas';
type TipoProyecto = 'En construcción' | 'Sobre planos' | 'No VIS' | 'VIS';
@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.scss'
})
export class FiltrosComponent implements OnInit {

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

  // Para Tipo de Propiedad
  isPropertyDropdownOpen = false;
  selectedProperty: PropertyOption = 'Todas';
  propertyOptions: PropertyOption[] = [
    'Todas',
    'Ventas',
    'Airbnb',
    'Arriendos',
  ];

  // Para Inmueble
  isEstateDropdownOpen = false;
  selectedEstate: EstateOption = 'Todas';
  estateOptions: EstateOption[] = [
    'Todas',
    'Amoblados',
    'Apartaestudios',
    'Apartamentos',
    'Casas',
  ];

  // Para Tipo de Proyecto
  isProjectDropdownOpen = false;
  selectedProject: TipoProyecto = 'En construcción';
  projectOptions: TipoProyecto[] = [
    'En construcción',
    'Sobre planos',
    'No VIS',
    'VIS',
  ];

  private readonly icons = {
    property: {
      Todas: 'fas fa-list-ul',
      Ventas: 'fas fa-dollar-sign',
      Airbnb: 'fas fa-home',
      Arriendos: 'fas fa-building',
    } as Record<PropertyOption, string>,
    estate: {
      Todas: 'fas fa-list-ul',
      Amoblados: 'fas fa-couch',
      Apartaestudios: 'fas fa-home-user',
      Apartamentos: 'fas fa-building',
      Casas: 'fas fa-house',
    } as Record<EstateOption, string>,
    project: {
      EnConstrucción: 'fas fa-building',
      SobrePlanos: 'fas fa-ruler-combined',
      NoVIS: 'fas fa-clipboard-list',
      VIS: 'fas fa-star',
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

  seleccionar(categoria: keyof typeof this.seleccion, valor: number | string) {
    // Para estrato, solo permitir números
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
  

  getIcon(
    type: 'property' | 'estate' | 'project',
    option: PropertyOption | EstateOption | TipoProyecto
  ): string {
    const icon =
      this.icons[type][option as keyof (typeof this.icons)[typeof type]];
    return icon || 'fas fa-question-circle';
  }

  toggleDropdown(type: 'property' | 'estate' | 'project'): void {
    if (type === 'property') {
      this.isPropertyDropdownOpen = !this.isPropertyDropdownOpen;
      this.isEstateDropdownOpen = false;
    }if (type === 'estate') {
      this.isEstateDropdownOpen = !this.isEstateDropdownOpen;
      this.isPropertyDropdownOpen = false;
    }else if (type === 'project') {
      this.isProjectDropdownOpen = !this.isProjectDropdownOpen;
      this.isPropertyDropdownOpen = false;
    }
  }

  selectOption(
    type: 'property' | 'estate' | 'project',
    option: PropertyOption | EstateOption | TipoProyecto
  ): void {
    if (type === 'property') {
      this.selectedProperty = option as PropertyOption;
      this.isPropertyDropdownOpen = false;
    }if (type === 'estate') {
      this.selectedEstate = option as EstateOption;
      this.isEstateDropdownOpen = false;
    }else if (type === 'project') {
      this.selectedProject = option as TipoProyecto;
      this.isProjectDropdownOpen = false;
    }
  }

  getButtonClass(selected: boolean): string {
    const base = 'flex items-center px-3 py-2 text-sm rounded-md';
    return selected
      ? `${base} bg-[#080E36] text-white`
      : `${base} bg-blue-100 text-blue-700`;
  }
}
