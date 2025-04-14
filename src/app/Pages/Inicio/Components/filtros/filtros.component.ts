import {
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { MapaComponent } from '../mapa/mapa.component';
import { GeolocalizacionService } from '../../../../core/Geolocalizacion/geolocalizacion.service';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, CommonModule, MapaComponent],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.scss',
})
export class FiltrosComponent implements OnInit {
  AreaMinima = '';
  AreaMaxima = '';
  precioVenta = '';
  precioMinimo = '';
  precioMaximo = '';
  totalDatos = 0;
  paginaActual = 1;
  totalPaginas = 0;
  elementsPerPage = 12;
  paginas: (number | string)[] = [];
  bloqueActual: number = 0; filtrosSeleccionados: Map<string, any> = new Map();
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
  ciudades: any[] = [];
  ubicacion: string = '';
  resultados: any[] = [];
  isDrawerOpen: boolean = true;
  drawerMapAbierto: boolean = false;
  filtrosVistaInicial: any = {};
  categoriasInmuebles: any[] = [];

  // Para Tipo de Propiedad
  isPropertyDropdownOpen = false;
  propertyOptions: { code: string; name: string; displayName?: string }[] = [];
  selectedProperty: {
    code: string;
    name: string;
    displayName?: string;
  } | null = null;

  // Para Inmueble
  isEstateDropdownOpen = false;
  estateOptions: { code: string; name: string }[] = [];
  selectedEstates: { code: string; name: string }[] = [];

  //geolocalizacion
  coordinates: {latitude: number, longitude: number} | null = null;
  error: string | null = null;
  loading = false;

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

  // Injectaciones
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);
  formBuilder = inject(FormBuilder);
  inmueblesService = inject(InmueblesService);
  geolocalizacionService = inject(GeolocalizacionService);

  mostrarMapa = false;

  formFiltrosSelect = this.formBuilder.group({
    opcion: ['']
  });



  async getLocation() {
    this.loading = true;
    this.error = null;
    this.coordinates = null;
    
    try {
      this.coordinates = await this.geolocalizacionService.getCurrentPosition();
      console.log('Coordenadas:', this.coordinates);
    } catch (err) {
      this.error = err as string;
    } finally {
      this.loading = false;
    }
  }

  async ngOnInit(): Promise<void> {
    console.log(this.isDrawerOpen);
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state?.resultados) {
      console.log('Estado recibido:', state);
      this.resultados = state.resultados;

      this.filtrosVistaInicial = state.filtros;
      this.paginacion = state.paginacion;

      this.totalPaginas = this.paginacion.last_page || 1;
      this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
      this.paginaActual = this.filtrosVistaInicial.page || 1;

      console.log('Paginacion:', this.paginacion);
      console.log('Filtros:', this.filtrosVistaInicial);
      console.log('Resultados:', this.resultados);

      this.inmueblesService.setPropiedades(this.resultados);

      this.getCiudades();
    }
    await this.getDatos();

    if (this.filtrosVistaInicial) {
      console.log('Inicializando filtros con:', this.filtrosVistaInicial);
      this.inicializarFiltrosDesdeVistaInicial();
      console.log('Filtros inicializados:', {
        selectedProperty: this.selectedProperty,
        selectedEstates: this.selectedEstates,
        seleccion: this.seleccion,
      });
    }

    this.cdRef.detectChanges();
  }

  async getDatos(): Promise<void> {
    try {
      const [categoriasResponse, tipoPropiedadResponse] = (await firstValueFrom(
        forkJoin([
          this.inmueblesService.getCategoriasInmuebles(),
          this.inmueblesService.getTipoPropiedad(),
        ])
      )) as [any, any];

      this.categoriasInmuebles = categoriasResponse.data;
      this.propertyOptions = this.categoriasInmuebles.map((cat: any) => {
        if (cat.code === '3') {
          return { ...cat, displayName: 'Todas' };
        }
        return cat;
      });

      this.selectedProperty =
        this.propertyOptions.find((cat) => cat.code === '3') ||
        this.propertyOptions[0];

      this.estateOptions = tipoPropiedadResponse.data;

      if (!this.filtrosVistaInicial?.type) {
        this.selectedEstates = [];
      } else {
        const estateCodes = this.filtrosVistaInicial.type.split(',');
        this.selectedEstates = this.estateOptions.filter((opt) =>
          estateCodes.includes(opt.code)
        );
      }

      this.generarPaginas();
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  toggleMap() {
    this.drawerMapAbierto = !this.drawerMapAbierto;
    this.mostrarMapa = true;

    const drawer = document.getElementById('right-map-drawer');

    if (drawer) {
      if (this.drawerMapAbierto) {
        drawer.classList.remove('translate-x-full');
        drawer.classList.add('translate-x-0');
      } else {
        drawer.classList.remove('translate-x-0');
        drawer.classList.add('translate-x-full');
      }
    }
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;


    const drawer = document.getElementById('right-map-drawer');
    if (drawer) {
      drawer.classList.remove('translate-x-0');
      drawer.classList.add('translate-x-full');
    }
    setTimeout(() => {
      this.mostrarMapa = true;
    }, 500);
    console.log(this.isDrawerOpen);
  }

  generarPaginas() {
    this.paginas = [];
    const paginasPorBloque = 3;
    const inicio = this.bloqueActual * paginasPorBloque + 1;
    const fin = Math.min(inicio + paginasPorBloque - 1, this.totalPaginas - 1);

    for (let i = inicio; i <= fin; i++) {
      this.paginas.push(i);
    }

    if (fin < this.totalPaginas - 1) {
      this.paginas.push('...');
    }

    if (this.totalPaginas > 1) {
      this.paginas.push(this.totalPaginas);
    }
  }

  irAlSiguienteBloque() {
    const maxBloques = Math.floor((this.totalPaginas - 1) / 3);
    if (this.bloqueActual < maxBloques) {
      this.bloqueActual++;
      this.generarPaginas();
    }
  }

  cambiarPagina(pagina: number | string) {
    if (pagina === '...') {
      this.irAlSiguienteBloque();
      return;
    }

    if (typeof pagina === 'number' && pagina !== this.paginaActual) {
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

    this.selectedProperty =
      this.propertyOptions.find((opt) => opt.code === f?.biz) ||
      this.selectedProperty;

    if (f?.type) {
      const estateCodes = f.type.split(',');
      this.selectedEstates = this.estateOptions.filter((opt) =>
        estateCodes.includes(opt.code)
      );
    }

    this.cdRef.detectChanges();
  }

  prepararFiltros() {

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

    if (this.selectedEstates.length > 0) {
      const estateCodes = this.selectedEstates.map((e) => e.code).join(',');
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
      this.filtrosSeleccionados.set(
        'stratum',
        this.seleccion.estrato.join(',')
      );
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
        console.log('filtros', response);
        this.resultados = response.data;
        this.totalDatos = response.total;

        this.paginacion = response;
        this.totalPaginas = response.last_page || 1;
        this.paginas = Array.from(
          { length: this.totalPaginas },
          (_, i) => i + 1
        );

        console.log('Paginas', this.paginas);
        this.generarPaginas();
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  enviarFiltrosSelect() {
    this.prepararFiltros();

    const opcion = this.formFiltrosSelect.value.opcion;
    if (opcion === 'order-mayor') {
      this.filtrosSeleccionados.set('order', 'pricemin');
    } else if (opcion === 'order-menor') {
      this.filtrosSeleccionados.set('order', 'pricemax');
    } else if (opcion === 'sort-asc') {
      this.filtrosSeleccionados.set('sort', 'asc');
      this.filtrosSeleccionados.set('order', 'consignation_date');
    } else if (opcion === 'sort-des') {
      this.filtrosSeleccionados.set('sort', 'desc');
      this.filtrosSeleccionados.set('order', 'consignation_date');
    }

    this.enviarFiltros(1);
  }

  seleccionar(categoria: keyof typeof this.seleccion, valor: number | string) {
    const arr = this.seleccion[categoria] as (number | string)[];
    const index = arr.indexOf(valor);
    index > -1 ? arr.splice(index, 1) : arr.push(valor);
  }

  isEstateSelected(option: any): boolean {
    return this.selectedEstates.some((o) => o.code === option.code);
  }

  selectOption(type: 'property' | 'estate', option: any): void {
    if (type === 'property') {
      this.selectedProperty =
        this.selectedProperty?.code === option.code ? null : option;
      this.isPropertyDropdownOpen = false;
    }

    if (type === 'estate') {
      const index = this.selectedEstates.findIndex(
        (o) => o.code === option.code
      );
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
    }
    if (type === 'estate') {
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
    } else {
      const code = typeof option === 'object' ? option.code : '';
      return this.icons.estate[code] || 'fas fa-question-circle';
    }
  }

  getCiudades() {
    this.inmueblesService.getCiudades().subscribe(
      (response: any) => {
        this.ciudades = response.data;
        console.log("ciudades", response.data);
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
        console.log('categorias', response.data);

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
        console.log('tipoPropiedad', response.data);

        this.selectedEstates = this.estateOptions.length
          ? [this.estateOptions[0]]
          : [];
      },
      (error: any) => {
        console.error('Error al obtener los tipos de propiedad:', error);
      }
    );
  }

  verPropiedad(codPro: number) {
    console.log("codPro", codPro);
    this.router.navigate(['/ver-propiedad', codPro], {
      state: { codPro: codPro }
    });
  }

  borrarFiltros() {
    this.filtrosSeleccionados.clear();
  }
}
