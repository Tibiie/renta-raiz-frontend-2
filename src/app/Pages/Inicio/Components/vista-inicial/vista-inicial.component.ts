import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';

@Component({
  selector: 'app-vista-inicial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    BotonesFlotantesComponent,
  ],
  templateUrl: './vista-inicial.component.html',
  styleUrls: ['./vista-inicial.component.scss'],
})
export class VistaInicialComponent implements OnInit {

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef | undefined;

  intervalId: any;
  currentSlide = 0;
  elementsPerPage = 12;
  searchTerm: string = '';
  elementsPerPageInicial = 3;
  filtrosSeleccionados: Map<string, any> = new Map();
  filtrosInmueblesVenta: Map<string, any> = new Map();
  filtrosInmueblesArriendo: Map<string, any> = new Map();

  filtros: any = {};
  ciudades: any[] = [];
  filteredBarrios: any[] = [];
  categoriasInmuebles: any[] = [];
  aliadosPorGrupo: string[][] = [];
  inmueblesVentasArray: any[] = [];
  inmueblesDestacadosArray: any = {};
  inmueblesArriendosArray: any[] = [];
  barrios: { data: any[] } = { data: [] };

  estrato: number[] = [1, 2, 3, 4];
  banos: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  parqueadero: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  habitaciones: (number | string)[] = [1, 2, 3, 4, 5, '+6'];

  seleccion = {
    estrato: [] as number[],
    banos: [] as (number | string)[],
    parqueadero: [] as (number | string)[],
    habitaciones: [] as (number | string)[],
  };

  isPreciosOpen = false;
  isMasFiltrosOpen = false;

  // Para Categorias de inmuebles
  isPropertyDropdownOpen = false;
  selectedProperty: {
    code: string;
    name: string;
    displayName?: string;
  } | null = null;
  propertyOptions: { code: string; name: string; displayName?: string }[] = [];

  // Para tipos de propiedades
  isEstateDropdownOpen = false;
  selectedEstate: { code: string; name: string } | null = null;
  estateOptions: { code: string; name: string }[] = [];

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
      '14': 'fas fa-home',
    } as Record<string, string>,
  };

  aliados: string[] = [
    'assets/images/sura.png',
    'assets/images/experian.png',
    'assets/images/fianzacredito.png',
    'assets/images/libertador.png',
    'assets/images/lonja.png',
  ];
  isLoading = true;

  // Injectaciones
  router = inject(Router);
  elementRef = inject(ElementRef);
  formBuilder = inject(FormBuilder);
  inmueblesService = inject(InmueblesService);

  formRangos = this.formBuilder.group({
    AreaMinima: [''],
    AreaMaxima: [''],
    precioMinimo: [''],
    precioMaximo: [''],
    ubicacion: [''],
  });

  ngOnInit(): void {
    this.getDatos();
    this.getAliadosPorGrupo();
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  getDatos() {
    this.getBarrios();
    this.getCiudades();
    this.getTipoPropiedad();
    this.getAliadosPorGrupo();
    this.getInmueblesVentas();
    this.getInmueblesArriendos();
    this.getCategoriasInmuebles();
    this.getInmueblesDestacados();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.cerrarTodosLosDropdowns();
    }
  }

  cerrarTodosLosDropdowns() {
    this.isPropertyDropdownOpen = false;
    this.isEstateDropdownOpen = false;
    this.isPreciosOpen = false;
    this.isMasFiltrosOpen = false;
  }

  seleccionar(categoria: keyof typeof this.seleccion, valor: number | string) {
    const arr = this.seleccion[categoria] as (number | string)[];
    const index = arr.indexOf(valor);
    index > -1 ? arr.splice(index, 1) : arr.push(valor);
  }

  prepararFiltros() {
    const skipUbicacion = this.filtrosSeleccionados.get('isManualSelection') === 'true';
    this.filtrosSeleccionados.delete('isManualSelection');

    if (!skipUbicacion) {
      const limpiarTexto = (texto: string) => {
        return texto?.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim()
          .toLowerCase() || '';
      };

      const ubicacionValue = this.formRangos.value.ubicacion;

      if (ubicacionValue) {
        // Buscar en barrios primero
        if (this.barrios?.data) {
          const barrioEncontrado = this.barrios.data.find(
            b => limpiarTexto(`${b.city_name},${b.name}`) === limpiarTexto(ubicacionValue)
          );

          if (barrioEncontrado) {
            this.filtrosSeleccionados.set('city', barrioEncontrado.city_code);
            this.filtrosSeleccionados.set('neighborhood', barrioEncontrado.code);
          }
        }

        // Buscar en ciudades si no se encontró en barrios
        if (!this.filtrosSeleccionados.has('city')) {
          const ciudad = this.ciudades.find(
            c => limpiarTexto(c.name) === limpiarTexto(ubicacionValue)
          );
          this.filtrosSeleccionados.set('city', ciudad?.code);
          this.filtrosSeleccionados.delete('neighborhood');
        }
      } else {
        this.filtrosSeleccionados.delete('city');
        this.filtrosSeleccionados.delete('neighborhood');
      }
    }

    if (this.selectedProperty) {
      this.filtrosSeleccionados.set('biz', this.selectedProperty.code);
    }

    if (this.selectedEstate) {
      this.filtrosSeleccionados.set('type', this.selectedEstate.code);
    }

    if (
      this.formRangos.value.AreaMinima != '' ||
      this.formRangos.value.AreaMaxima != ''
    ) {
      this.filtrosSeleccionados.set(
        'minarea',
        this.formRangos.value.AreaMinima
      );
      this.filtrosSeleccionados.set(
        'maxarea',
        this.formRangos.value.AreaMaxima
      );
    }

    if (
      this.formRangos.value.precioMinimo != '' ||
      this.formRangos.value.precioMaximo != ''
    ) {
      if (
        this.selectedProperty?.code == '1' ||
        this.selectedEstate?.code == '3'
      ) {
        this.filtrosSeleccionados.set(
          'pcmin',
          this.formRangos.value.precioMinimo
        );
        this.filtrosSeleccionados.set(
          'pcmax',
          this.formRangos.value.precioMaximo
        );
      }

      if (
        this.selectedEstate?.code == '2' ||
        this.selectedProperty?.code == '3'
      ) {
        this.filtrosSeleccionados.set(
          'pvmin',
          this.formRangos.value.precioMinimo
        );
        this.filtrosSeleccionados.set(
          'pvmax',
          this.formRangos.value.precioMaximo
        );
      }
    }

    if (this.seleccion.banos.length > 0) {
      const values = this.seleccion.banos;
      if (values.includes('+6')) {
        this.filtrosSeleccionados.set('maxbathroom', 100);
        this.filtrosSeleccionados.set('minbathroom', 6);
      } else {
        this.filtrosSeleccionados.set('bathrooms', values.join(','));
      }
    }

    if (this.seleccion.parqueadero.length > 0) {
      const values = this.seleccion.parqueadero;
      if (values.includes('+6')) {
        this.filtrosSeleccionados.set('maxparking', 100);
        this.filtrosSeleccionados.set('minparking', 6);
      } else {
        this.filtrosSeleccionados.set('maxparking', values.join(','));
        this.filtrosSeleccionados.set('minparking', values.join(','));
      }
    }

    if (this.seleccion.estrato.length > 0) {
      this.filtrosSeleccionados.set(
        'stratum',
        this.seleccion.estrato.join(',')
      );
    }

    if (this.seleccion.habitaciones.length > 0) {
      const values = this.seleccion.habitaciones;
      if (values.includes('+6')) {
        this.filtrosSeleccionados.set('maxbedroom', 100);
        this.filtrosSeleccionados.set('minbedroom', 6);
      } else {
        this.filtrosSeleccionados.set('bedrooms', values.join(','));
      }
    }
  }

  filterLocations() {
    const search = this.searchTerm.toLowerCase();
    this.filteredBarrios = this.barrios.data.filter(
      (barrio: any) =>
        barrio.name.toLowerCase().includes(search) ||
        barrio.city_name.toLowerCase().includes(search)
    );
  }

  selectLocation(barrio: any) {
    this.searchTerm = `${barrio.city_name}, ${barrio.name}`;
    this.filteredBarrios = [];

    this.formRangos
      .get('ubicacion')
      ?.setValue(`${barrio.city_name},${barrio.name}`);

    this.filtrosSeleccionados.set('city', barrio.city_code);
    this.filtrosSeleccionados.set('neighborhood', barrio.code);
    this.filtrosSeleccionados.set('isManualSelection', 'true');
  }

  getEnviarFiltros() {
    this.prepararFiltros();

    const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);
    const obj = {
      ...filtrosObj,
      page: 1,
    };

    console.log('filtrosObj', filtrosObj);

    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        this.router.navigate(['/filtros'], {
          state: {
            resultados: response.data,
            paginacion: response,
            filtros: obj,
          },
        });
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
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

        const defaultOption =
          this.propertyOptions.find((cat) => cat.code === '3') ||
          this.propertyOptions[0];
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

  getInmueblesVentas() {
    this.filtrosInmueblesVenta.clear();
    this.filtrosInmueblesVenta.set('biz', 2);

    const filtrosObj = Object.fromEntries(this.filtrosInmueblesVenta);
    const obj = {
      ...filtrosObj,
      page: 2,
    };
    this.inmueblesService
      .getFiltrosEnviar(obj, this.elementsPerPageInicial)
      .subscribe(
        (response: any) => {
          this.inmueblesVentasArray = response.data.filter(
            (inmueble: any) => inmueble.image1 != ""
          );
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
    };
    this.inmueblesService
      .getFiltrosEnviar(obj, this.elementsPerPageInicial)
      .subscribe(
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
        this.inmueblesDestacadosArray = data.data.slice(2, 5);
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener los inmuebles:', error);
      }
    );
  }

  getBarrios() {
    this.inmueblesService.getBarrios().subscribe(
      (data: any) => {
        this.barrios = data;
      },
      (error: any) => {
        console.log(error);
        console.error('Error al obtener los barrios:', error);
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

    if (option) {
      const code = typeof option === 'object' ? option.code : '';
      const iconMap = this.icons[type];

      return iconMap?.[code] || defaultIcons[type];
    } else {
      return '';
    }
  }

  selectOption(type: 'property' | 'estate', option: any): void {
    if (type === 'property') {
      this.selectedProperty = option;
      this.isPropertyDropdownOpen = false;
    } else {
      this.selectedEstate = option;
      this.isEstateDropdownOpen = false;
    }
  }

  toggleDropdown(type: 'property' | 'estate' | 'masFiltros' | 'precios'): void {
    if (type === 'property') {
      this.isPropertyDropdownOpen = !this.isPropertyDropdownOpen;
      this.isEstateDropdownOpen = false;
      this.isMasFiltrosOpen = false;
      this.isPreciosOpen = false;
    } else if (type === 'masFiltros') {
      this.isMasFiltrosOpen = !this.isMasFiltrosOpen;
      this.isPropertyDropdownOpen = false;
      this.isEstateDropdownOpen = false;
      this.isPreciosOpen = false;
    } else if (type === 'precios') {
      this.isPreciosOpen = !this.isPreciosOpen;
      this.isPropertyDropdownOpen = false;
      this.isEstateDropdownOpen = false;
      this.isMasFiltrosOpen = false;
    } else {
      this.isEstateDropdownOpen = !this.isEstateDropdownOpen;
      this.isPropertyDropdownOpen = false;
      this.isMasFiltrosOpen = false;
      this.isPreciosOpen = false;
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

  redirigirVerBlog(id: number) {
    const url = this.router.createUrlTree(['/ver-blog', id]).toString();
    window.open(url, '_blank');
  }

  getAliadosPorGrupo(): void {
    this.aliadosPorGrupo = [];
    for (let i = 0; i < this.aliados.length; i += 3) {
      this.aliadosPorGrupo.push(this.aliados.slice(i, i + 4));
      this.aliadosPorGrupo.push(this.aliados.slice(i, i + 4));
    }
    // console.log(this.aliadosPorGrupo);
  }

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

  verPropiedad(codPro: number) {
    const url = this.router.createUrlTree(['/ver-propiedad', codPro]).toString();
    window.open(url, '_blank');
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredBarrios = [];
  }
}
