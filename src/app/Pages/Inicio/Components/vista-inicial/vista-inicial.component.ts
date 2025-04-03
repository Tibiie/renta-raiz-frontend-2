import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";

type PropertyOption = 'Todas' | 'Ventas' | 'Airbnb' | 'Arriendos';
type EstateOption = 'Todas' | 'Amoblados' | 'Apartaestudios' | 'Apartamentos' | 'Casas';

@Component({
  selector: 'app-vista-inicial',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './vista-inicial.component.html',
  styleUrls: ['./vista-inicial.component.scss']
})
export class VistaInicialComponent {
  // Para Tipo de Propiedad
  isPropertyDropdownOpen = false;
  selectedProperty: PropertyOption = 'Todas';
  propertyOptions: PropertyOption[] = ['Todas', 'Ventas', 'Airbnb', 'Arriendos'];

  // Para Inmueble
  isEstateDropdownOpen = false;
  selectedEstate: EstateOption = 'Todas';
  estateOptions: EstateOption[] = ['Todas', 'Amoblados', 'Apartaestudios', 'Apartamentos', 'Casas'];

  private readonly icons = {
    property: {
      'Todas': 'fas fa-list-ul',
      'Ventas': 'fas fa-dollar-sign',
      'Airbnb': 'fas fa-home',
      'Arriendos': 'fas fa-building'
    } as Record<PropertyOption, string>,
    estate: {
      'Todas': 'fas fa-list-ul',
      'Amoblados': 'fas fa-couch',
      'Apartaestudios': 'fas fa-home-user',
      'Apartamentos': 'fas fa-building',
      'Casas': 'fas fa-house'
    } as Record<EstateOption, string>
  };

  getIcon(type: 'property' | 'estate', option: PropertyOption | EstateOption): string {
    const icon = this.icons[type][option as keyof typeof this.icons[typeof type]];
    return icon || 'fas fa-question-circle';
  }


  toggleDropdown(type: 'property' | 'estate'): void {
    if (type === 'property') {
      this.isPropertyDropdownOpen = !this.isPropertyDropdownOpen;
      this.isEstateDropdownOpen = false;
    } else {
      this.isEstateDropdownOpen = !this.isEstateDropdownOpen;
      this.isPropertyDropdownOpen = false;
    }
  }

  selectOption(type: 'property' | 'estate', option: PropertyOption | EstateOption): void {
    if (type === 'property') {
      this.selectedProperty = option as PropertyOption;
      this.isPropertyDropdownOpen = false;
    } else {
      this.selectedEstate = option as EstateOption;
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