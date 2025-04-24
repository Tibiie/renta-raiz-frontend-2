import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router } from '@angular/router';
import { FooterComponent } from "../../../../shared/footer/footer.component";
import { BotonesFlotantesComponent } from "../../../../shared/botones-flotantes/botones-flotantes.component";


@Component({
  selector: 'app-vista-inicial',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, BotonesFlotantesComponent],
  templateUrl: './vista-inicial.component.html',
  styleUrls: ['./vista-inicial.component.scss'],
})
export class VistaInicialComponent implements OnInit {

  intervalId: any;
  currentSlide = 0;
  elementsPerPage = 12;
  elementsPerPageInicial = 3;
  ubicacion: string = '';
  filtrosSeleccionados: Map<string, any> = new Map();
  filtrosInmueblesVenta: Map<string, any> = new Map();
  filtrosInmueblesArriendo: Map<string, any> = new Map();

  filtros: any = {};
  ciudades: any[] = [];
  categoriasInmuebles: any[] = [];
  inmueblesVentasArray: any[] = [];
  inmueblesDestacadosArray: any = {};
  inmueblesArriendosArray: any[] = [];

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
  grupos: string[][] = [];
  isLoading = true;

  // Injectaciones
  inmueblesService = inject(InmueblesService);
  router = inject(Router);

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    this.getInmueblesVentas();
    this.getInmueblesArriendos();
    this.getCategoriasInmuebles();
    this.getCiudades();
    this.getFiltros();
    this.getTipoPropiedad();
    this.getInmueblesDestacados();
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
    }, 3000);
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

  verPropiedad(codPro: number) {
    this.router.navigate(['/ver-propiedad', codPro], {
      state: { codPro: codPro }
    });
  }

  getCiudades() {
    this.inmueblesService.getCiudades().subscribe(
      (response: any) => {
        this.ciudades = response.data;
      },
      (error: any) => {
        console.error('Error al obtener las ciudades:', error);
      }
    );
  }

  getCategoriasInmuebles() {
    this.inmueblesService.getCategoriasInmuebles().subscribe(
      (response: any) => {
        this.categoriasInmuebles = response.data;

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
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener los filtros:', error);
      }
    );
  }

  prepararFiltros() {
    this.filtrosSeleccionados.clear();

    const limpiarTexto = (texto: string) => {
      return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
    };

    const ciudad = this.ciudades.find(c =>
      limpiarTexto(c.name) === limpiarTexto(this.ubicacion)
    );
    var codigo = ciudad?.code;

    if (this.ubicacion) {
      this.filtrosSeleccionados.set('city', codigo);
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
    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        this.router.navigate(['/filtros'], {
          state: { resultados: response.data, paginacion: response, filtros: obj }
        });
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  getInmueblesVentas() {
    this.filtrosInmueblesVenta.clear();
    this.filtrosInmueblesVenta.set('biz', 2);

    const filtrosObj = Object.fromEntries(this.filtrosInmueblesVenta);
    const obj = {
      ...filtrosObj,
      page: 1,
    }
    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPageInicial).subscribe(
      (response: any) => {
        this.inmueblesVentasArray = response.data;
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  getInmueblesArriendos() {
    this.filtrosInmueblesArriendo.clear();
    this.filtrosInmueblesArriendo.set('biz', 1);

    const filtrosObj = Object.fromEntries(this.filtrosInmueblesArriendo);
    const obj = {
      ...filtrosObj,
      page: 1,
    }
    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPageInicial).subscribe(
      (response: any) => {
        this.inmueblesArriendosArray = response.data;
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
      estate: 'fas fa-question-circle',
    };

    if (!option && type === 'property') {
      return 'fas fa-list-ul';
    }

    console.log(option);

    if (option) {
      const code = typeof option === 'object' ? option.code : '';
      const iconMap = this.icons[type];

      return iconMap?.[code] || defaultIcons[type];
    } else {
      return '';
    }
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
}
