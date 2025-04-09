import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { get } from 'http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


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
  ubicacion: string = '';
  filtrosSeleccionados: Map<string, any> = new Map();

  elementsPerPage = 12;
  filtros: any = {};
  categoriasInmuebles: any[] = [];
  inmueblesDestacadosArray: any = {};

  // Para Categorias de inmuebles
  isPropertyDropdownOpen = false;
  selectedProperty: { code: string, name: string, displayName?: string } | null = null;
  propertyOptions: { code: string, name: string, displayName?: string }[] = [];

  // Para tipos de propiedades
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDatos()
  }

  getDatos() {
    this.getFiltros();
    this.getTipoPropiedad();
    this.getInmueblesDestacados();
    this.getCategoriasInmuebles();
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

  getFiltros() {
    this.inmueblesService.getFiltros().subscribe(
      (data: any) => {
        this.filtros = data;
        console.log("filtros", data);
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener los filtros:', error);
      }
    );
  }

  prepararFiltros() {
    this.filtrosSeleccionados.clear();

    if (this.ubicacion) {
      this.filtrosSeleccionados.set('neighborhood', this.ubicacion);
    }

    if (this.selectedProperty) {
      this.filtrosSeleccionados.set('biz', this.selectedProperty.code);
    }

    if (this.selectedEstate) {
      this.filtrosSeleccionados.set('type', this.selectedEstate.code);
    }
  }

  getEnviarFiltros() {
    const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);
    const obj = {
      ...filtrosObj,
      page: 1,
    }
    console.log('Objeto a enviar:', obj);
    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        console.log("filtros", response.data);
        this.router.navigate(['/filtros'], {
          state: { resultados: response.data, paginacion: response, filtros: obj }
        });
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  getInmueblesDestacados() {
    this.inmueblesService.getInmueblesDestacados().subscribe(
      (data: any) => {
        this.inmueblesDestacadosArray = data;
        console.log("inmuebles destacados", data);
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener los inmuebles:', error);
      }
    );
  }

  getIcon(type: 'property' | 'estate', option: any): string {
    const defaultIcons = {
      property: 'fas fa-home',
      estate: 'fas fa-question-circle'
    };

    if (!option && type === 'property') {
      return 'fas fa-list-ul';
    }

    const code = typeof option === 'object' ? option.code : '';
    const iconMap = this.icons[type];

    return iconMap?.[code] || defaultIcons[type];
  }


  selectOption(
    type: 'property' | 'estate',
    option: any
  ): void {
    if (type === 'property') {
      this.selectedProperty = option;
      this.isPropertyDropdownOpen = false;
    } else {
      this.selectedEstate = option;
      this.isEstateDropdownOpen = false;
    }
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

  getButtonClass(selected: boolean): string {
    const base = 'flex items-center px-3 py-2 text-sm rounded-md';
    return selected
      ? `${base} bg-[#080E36] text-white`
      : `${base} bg-blue-100 text-blue-700`;
  }

  redirigirFiltros() {
    this.prepararFiltros();
    this.getEnviarFiltros();
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

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

  verPropiedad(codPro: number) {
    console.log("codPro", codPro);
    this.router.navigate(['/ver-propiedad'], {
      state: { codPro: codPro }
    });
  }
}
