import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { get } from 'http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


type PropertyOption = 'Todas' | 'Ventas' | 'Airbnb' | 'Arriendos';
type EstateOption =
  | 'Todas'
  | 'Amoblados'
  | 'Apartaestudios'
  | 'Apartamentos'
  | 'Casas';
@Component({
  selector: 'app-vista-inicial',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './vista-inicial.component.html',
  styleUrls: ['./vista-inicial.component.scss'],
})
export class VistaInicialComponent implements OnInit {

  intervalId: any;
  currentSlide = 0;

  tipoPropiedad: any[] = [];
  categoriasInmuebles: any[] = [];
  inmueblesDestacadosArray: any[] = [];

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
  };

  aliados: string[] = [
    'assets/images/sura.png',
    'assets/images/experian.png',
    'assets/images/fianzacredito.png',
    'assets/images/libertador.png',
    'assets/images/lonja.png',
    'assets/images/sura.png',
    'assets/images/experian.png',
    'assets/images/fianzacredito.png',
  ];


  constructor(
    private inmueblesService: InmueblesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getTipoPropiedad();
    this.getInmueblesDestacados();
    this.getCategoriasInmuebles();
  }

  getInmueblesDestacados() {
    this.inmueblesService.getInmueblesDestacados().subscribe(
      (data: any) => {
        this.inmueblesDestacadosArray = data;
        console.log(data);
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener los inmuebles:', error);
      }
    );
  }

  getTipoPropiedad() {
    this.inmueblesService.getTipoPropiedad().subscribe(
      (data: any) => {
        this.tipoPropiedad = data;
        console.log(data);
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener los inmuebles:', error);
      }
    );
  }

  getCategoriasInmuebles() {
    this.inmueblesService.getCategoriasInmuebles().subscribe(
      (data: any) => {
        this.categoriasInmuebles = data;
        console.log(data);
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener las categorias:', error);
      }
    );
  }

  getIcon(
    type: 'property' | 'estate',
    option: PropertyOption | EstateOption
  ): string {
    const icon =
      this.icons[type][option as keyof (typeof this.icons)[typeof type]];
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

  selectOption(
    type: 'property' | 'estate',
    option: PropertyOption | EstateOption
  ): void {
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

  redirigirFiltros() {
    this.router.navigate(['/filtros']);
  }

  getAliadosPorGrupo(): string[][] {
    const grupos: string[][] = [];
    for (let i = 0; i < this.aliados.length; i += 4) {
      grupos.push(this.aliados.slice(i, i + 4));
    }
    return grupos;
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      const totalSlides = this.getAliadosPorGrupo().length;
      this.currentSlide = (this.currentSlide + 1) % totalSlides;
    }, 3000); // cambia cada 3 segundos
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
