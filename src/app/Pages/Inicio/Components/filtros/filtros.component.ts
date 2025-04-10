import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.scss'
})
export class FiltrosComponent implements OnInit {

  AreaMinima = '';
  AreaMaxima = '';
  precioVenta = '';
  precioMinimo = '';
  precioMaximo = '';
  paginaActual = 1;
  totalPaginas = 0;
  elementsPerPage = 12;
  paginas: number[] = [];
  filtrosSeleccionados: Map<string, any> = new Map();
  estrato: number[] = [1, 2, 3, 4];
  banos: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  parqueadero: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  habitaciones: (number | string)[] = [1, 2, 3, 4, 5, '+6'];

  seleccion = {
    habitaciones: [] as (number | string)[],
    banos: [] as (number | string)[],
    parqueadero: [] as (number | string)[],
    estrato: [] as number[],
  };

  paginacion: any = {};
  resultados: any[] = [];
  isDrawerOpen: boolean = true;
  filtrosVistaInicial: any = {};
  categoriasInmuebles: any[] = [];


  // Para Tipo de Propiedad
  isPropertyDropdownOpen = false;
  propertyOptions: { code: string, name: string, displayName?: string }[] = [];
  selectedProperty: { code: string, name: string, displayName?: string } | null = null;

  // Para Inmueble
  isEstateDropdownOpen = false;
  estateOptions: { code: string, name: string }[] = [];
  selectedEstates: { code: string, name: string }[] = [];

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
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private inmueblesService: InmueblesService,
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(this.isDrawerOpen);
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state?.resultados) {
      console.log('Estado recibido:', state);
      this.resultados = state.resultados;
      this.filtrosVistaInicial = state.filtros;
      this.paginacion = state.paginacion;

      this.totalPaginas = this.paginacion.totalPages || 1;
      this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
      this.paginaActual = this.filtrosVistaInicial.page || 1;

      console.log('Paginacion:', this.paginacion);
      console.log('Filtros:', this.filtrosVistaInicial);
      console.log('Resultados:', this.resultados);
    }

    await this.getDatos();

    console.log('Opciones cargadas:', {
      propertyOptions: this.propertyOptions,
      estateOptions: this.estateOptions
    });

    if (this.filtrosVistaInicial) {
      console.log('Inicializando filtros con:', this.filtrosVistaInicial);
      this.inicializarFiltrosDesdeVistaInicial();
      console.log('Filtros inicializados:', {
        selectedProperty: this.selectedProperty,
        selectedEstates: this.selectedEstates,
        seleccion: this.seleccion
      });
    }

    this.cdRef.detectChanges();
  }

  async getDatos(): Promise<void> {
    try {
      const [categoriasResponse, tipoPropiedadResponse] = await firstValueFrom(
        forkJoin([
          this.inmueblesService.getCategoriasInmuebles(),
          this.inmueblesService.getTipoPropiedad()
        ])
      ) as [any, any];

      this.categoriasInmuebles = categoriasResponse.data;
      this.propertyOptions = this.categoriasInmuebles.map((cat: any) => {
        if (cat.code === '3') {
          return { ...cat, displayName: 'Todas' };
        }
        return cat;
      });
      this.selectedProperty = this.propertyOptions.find(cat => cat.code === '3') || this.propertyOptions[0];

      this.estateOptions = tipoPropiedadResponse.data;
      this.selectedEstates = this.estateOptions.length ? [this.estateOptions[0]] : [];
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
  

  enviarFiltros(pagina: number = 1) {
    this.paginaActual = pagina;
    this.prepararFiltros();

    const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);
    const obj = {
      ...filtrosObj,
      page: pagina,
    };

    console.log('Objeto a enviar:', obj);

    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        console.log("filtros", response.data);
        this.resultados = response.data;

        this.paginacion = response;
        this.totalPaginas = response.totalPages || 1;
        this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);

        console.log("Paginas", this.paginas);
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  cambiarPagina(pagina: number) {
    if (pagina !== this.paginaActual) {
      this.enviarFiltros(pagina);
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.enviarFiltros(this.paginaActual - 1);
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.enviarFiltros(this.paginaActual + 1);
    }
  }

  inicializarFiltrosDesdeVistaInicial() {
    const f = this.filtrosVistaInicial;

    this.selectedProperty = this.propertyOptions.find(opt => opt.code === f?.biz) || this.selectedProperty;

    if (f?.type) {
      const estateCodes = f.type.split(',');
      this.selectedEstates = this.estateOptions.filter(opt => estateCodes.includes(opt.code));
    }

    this.seleccion.habitaciones = this.inicializarRango(f, 'bedroom');
    this.seleccion.banos = this.inicializarRango(f, 'bathroom');
    this.seleccion.parqueadero = this.inicializarParqueadero(f?.minparking);
    this.seleccion.estrato = f?.stratum?.split(',').map(Number) || [];

    this.AreaMinima = f?.minarea || '';
    this.AreaMaxima = f?.maxarea || '';

    this.cdRef.detectChanges();
  }

  private inicializarRango(f: any, campo: string): (number | string)[] {
    return f?.[`${campo}s`]?.split(',') || (f?.[`min${campo}`] ? ['+6'] : []);
  }

  private inicializarParqueadero(min: string): (number | string)[] {
    return min === '6' ? ['+6'] : min ? [min] : [];
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

    if (this.precioMinimo) {
      this.filtrosSeleccionados.set('""pcmin""', this.precioMinimo);
    }

    if (this.precioMaximo) {
      this.filtrosSeleccionados.set('""pcmax""', this.precioMaximo);
    }

    if (this.precioVenta) {
      this.filtrosSeleccionados.set('""saleprice""', this.precioVenta);
    }
  }

  seleccionar(categoria: keyof typeof this.seleccion, valor: number | string) {
    const arr = this.seleccion[categoria] as (number | string)[];
    const index = arr.indexOf(valor);
    index > -1 ? arr.splice(index, 1) : arr.push(valor);
  }

  isEstateSelected(option: any): boolean {
    return this.selectedEstates.some(o => o.code === option.code);
  }

  selectOption(
    type: 'property' | 'estate',
    option: any
  ): void {
    if (type === 'property') {
      this.selectedProperty = this.selectedProperty?.code === option.code ? null : option;
      this.isPropertyDropdownOpen = false;
    }

    if (type === 'estate') {
      const index = this.selectedEstates.findIndex(o => o.code === option.code);
      if (index > -1) {
        this.selectedEstates.splice(index, 1);
      } else {
        this.selectedEstates.push(option);
      }
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

  getButtonClass(condition: boolean): string {
    const base = 'flex items-center px-3 py-2 text-sm rounded-md';
    return condition
      ? `${base} bg-[#080E36] text-white`
      : `${base} bg-blue-100 text-blue-700`;
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

        this.selectedEstates = this.estateOptions.length ? [this.estateOptions[0]] : [];
      },
      (error: any) => {
        console.error('Error al obtener los tipos de propiedad:', error);
      }
    );
  }
}
