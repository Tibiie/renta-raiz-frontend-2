declare var fbq: Function;
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { MapaComponent } from '../mapa/mapa.component';
import { GeolocalizacionService } from '../../../../core/Geolocalizacion/geolocalizacion.service';
import { VolverComponent } from "../../../../shared/volver/volver.component";
import { FooterComponent } from "../../../../shared/footer/footer.component";

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    VolverComponent,
    FooterComponent
  ],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.scss',
})
export class FiltrosComponent implements OnInit {
  totalDatos = 0;
  totalPaginas = 0;
  paginaActual = 1;
  elementsPerPage = 12;
  bloqueActual: number = 0;
  isDesktopView = window.innerWidth >= 768;

  seleccion = {
    estrato: [] as number[],
    banos: [] as (number | string)[],
    parqueadero: [] as (number | string)[],
    habitaciones: [] as (number | string)[],
  };

  searchTerm: string = '';
  ubicacion: string = '';

  cargando = false;
  isDrawerOpen: boolean = true;
  drawerMapAbierto: boolean = false;

  paginacion: any = {};
  ciudades: any[] = [];
  resultados: any[] = [];
  filteredBarrios: any[] = [];
  filtrosVistaInicial: any = {};
  filtrosDesdeNavbar: any = {};
  categoriasInmuebles: any[] = [];
  estrato: number[] = [1, 2, 3, 4];
  paginas: (number | string)[] = [];
  barrios: { data: any[] } = { data: [] };
  banos: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  filtrosSeleccionados: Map<string, any> = new Map();
  parqueadero: (number | string)[] = [1, 2, 3, 4, 5, '+6'];
  habitaciones: (number | string)[] = [1, 2, 3, 4, 5, '+6'];

  // Para los Rangos de Precios
  selectedPriceRange: { min: number, max: number | null } | null = null;
  priceRanges = [
    { min: 2000000, max: 8000000, displayName: '2.000.000 - 8.000.000' },
    { min: 8000000, max: 15000000, displayName: '8.000.000 - 15.000.000' },
    { min: 15000000, max: null, displayName: '15.000.000 +' }
  ];

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
  isMobileView = window.innerWidth < 768;
  estateOptions: { code: string; name: string }[] = [];
  selectedEstates: { code: string; name: string }[] = [];

  //geolocalizacion
  coordinates: { latitude: number; longitude: number } | null = null;
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
  activatedRoute = inject(ActivatedRoute);

  mostrarMapa = false;
  address: string | null = null;

  formRangos = this.formBuilder.group({
    AreaMinima: [''],
    AreaMaxima: [''],
    precioVentaMinimo: [''],
    precioVentaMaximo: [''],
    precioMinimo: [''],
    precioMaximo: [''],
  });

  formFiltrosSelect = this.formBuilder.group({
    opcion: [''],
  });

  async ngOnInit(): Promise<void> {
    window.scrollTo(0, 0);
    const state = window.history.state;
    await this.getDatos();
    var queryParams = this.activatedRoute.snapshot.queryParams;
    console.log(queryParams);

    if (queryParams['biz']) {
      this.selectedProperty = {
        code: queryParams['biz'],
        name: '',
        displayName: ''
      } as any;
    }

    if (Object.keys(queryParams).length == 1) {
      this.filtrosSeleccionados.clear();
      this.selectedProperty = null;
      this.selectedEstates = [];
      this.seleccion = {
        habitaciones: [],
        banos: [],
        parqueadero: [],
        estrato: [],
      };
      this.formRangos.patchValue({
        AreaMinima: null,
        AreaMaxima: null,
        precioVentaMinimo: null,
        precioVentaMaximo: null,
        precioMinimo: null,
        precioMaximo: null,
      });

      var biz = queryParams["biz"]
      if (biz) {
        this.filtrosSeleccionados.set('biz', biz);
        this.enviarFiltros()
      } else {
        this.router.navigate(['']);
      }
    }

    if (Object.keys(queryParams).length > 1) {

      this.filtrosSeleccionados.clear();
      this.selectedProperty = null;
      this.selectedEstates = [];
      this.seleccion = {
        habitaciones: [],
        banos: [],
        parqueadero: [],
        estrato: [],
      };
      this.formRangos.patchValue({
        AreaMinima: null,
        AreaMaxima: null,
        precioVentaMinimo: null,
        precioVentaMaximo: null,
        precioMinimo: null,
        precioMaximo: null,
      });

      var biz = queryParams["biz"]
      var elementsPerPage = queryParams["elementsPerPage"];
      if (biz && elementsPerPage) {

        this.filtrosSeleccionados.set('biz', biz);
        this.filtrosSeleccionados.set('elementsPerPage', elementsPerPage);

        var city = queryParams["city"];
        if (city) {
          this.filtrosSeleccionados.set('city', city);
        } else {
          var barrio = queryParams["neighborhood_code"];
          if (barrio) {
            this.filtrosSeleccionados.set('neighborhood_code', barrio);
          } else {
            this.router.navigate(['']);
          }
        }
        this.enviarFiltros()
      } else {
        this.router.navigate(['']);
      }

    } else {
      this.cargarDesdeState(state);
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const newState = window.history.state;
          this.cargarDesdeState(newState);
        }
      });
    }
    this.isDrawerOpen = !this.isMobileView;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isDesktopView = window.innerWidth >= 768;

    if (!this.isDesktopView) {
      this.isDrawerOpen = false;
    }
  }

  buildPolygon(lat: any, lng: any, delta = 0.001) {
    return [
      [
        [lat + delta, lng - delta],
        [lat + delta, lng + delta],
        [lat - delta, lng + delta],
        [lat - delta, lng - delta],
      ],
    ];
  }

  async getLocation() {
    this.loading = true;
    this.error = null;
    this.coordinates = null;

    try {
      this.coordinates = await this.geolocalizacionService.getCurrentPosition();
      console.log('Coordenadas:', this.coordinates);

      // 2. Obtener dirección
      this.geolocalizacionService
        .getAddress(this.coordinates.latitude, this.coordinates.longitude)
        .subscribe((response: any) => {
          if (response.results[0]) {
            this.address = response.results[0].formatted_address;
            console.log('Dirección:', this.address);
          }
        });
    } catch (err) {
      this.error = err as string;
    } finally {
      this.loading = false;
    }
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

      this.getBarrios();
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
    if (f?.pcmin !== undefined && f.pcmin !== null) {
      this.formRangos.patchValue({
        precioMinimo: f.pcmin.toString(),
        precioMaximo: f.pcmax !== undefined ? f.pcmax.toString() : null
      });

      // Esto convierte a number para comparar
      const pcmin = Number(f.pcmin);
      const pcmax = f.pcmax !== undefined ? Number(f.pcmax) : null;

      this.selectedPriceRange = this.priceRanges.find(range => {
        return range.min === pcmin &&
          (range.max === pcmax || (range.max === null && pcmax === null));
      }) || null;

      if (!this.selectedPriceRange) {
        this.selectedPriceRange = this.priceRanges.find(range => {
          return pcmin >= range.min &&
            (range.max === null || (pcmax !== null && pcmax <= range.max));
        }) || null;
      }

      // Asegurar que los filtros tienen los valores iniciales como strings
      this.filtrosSeleccionados.set('pcmin', f.pcmin.toString());
      if (f.pcmax !== undefined) {
        this.filtrosSeleccionados.set('pcmax', f.pcmax.toString());
      }
    }

    this.selectedProperty =
      this.propertyOptions.find((opt) => opt.code === f?.biz) ||
      this.selectedProperty;

    if (f?.type) {
      const estateCodes = f.type.split(',');
      this.selectedEstates = this.estateOptions.filter((opt) =>
        estateCodes.includes(opt.code)
      );
    }

    const convertirSoloNumeros = (valores: string | string[] | undefined) => {
      if (!valores) return [];
      const valoresArray = Array.isArray(valores)
        ? valores
        : valores.split(',');
      return valoresArray.map(Number).filter((v) => !isNaN(v));
    };

    const convertirConPlusSeis = (
      min: any,
      max: any,
      raw?: string | string[]
    ) => {
      const minVal = Number(min);
      const maxVal = Number(max);

      if (minVal === 6 && maxVal === 100) {
        return ['+6'];
      }

      const valores = Array.isArray(raw) ? raw : raw ? raw.split(',') : [];

      const valoresProcesados =
        valores
          .map((v) => (v === '+6' ? '+6' : Number(v)))
          .filter((v) => v || v === 0) || [];

      if (minVal === 6 && maxVal === 100) {
        valoresProcesados.push('+6');
      }

      return valoresProcesados;
    };

    this.seleccion = {
      habitaciones: convertirConPlusSeis(
        f?.minbedroom,
        f?.maxbedroom,
        f?.bedrooms
      ),
      banos: convertirConPlusSeis(f?.minbathroom, f?.maxbathroom, f?.bathrooms),
      parqueadero: convertirConPlusSeis(
        f?.minparking,
        f?.maxparking,
        f?.minparking
      ),
      estrato: convertirSoloNumeros(f?.stratum),
    };

    this.formRangos.value.AreaMinima = f?.minarea;
    this.formRangos.value.AreaMaxima = f?.maxarea;

    if (f?.type === '1' || f?.type === '3') {
      this.formRangos.value.precioMinimo = f?.pcmin;
      this.formRangos.value.precioMaximo = f?.pcmax;
    }

    if (f?.type === '2' || f?.type === '3') {
      this.formRangos.value.precioVentaMinimo =
        f?.type === '2' ? f?.pvmin : f?.pcmin;
      this.formRangos.value.precioVentaMaximo =
        f?.type === '2' ? f?.pvmax : f?.pcmax;
    }

    this.cdRef.detectChanges();
  }

  async cargarDesdeState(state: any) {
    if (state?.resultados) {
      this.resultados = [...state.resultados];
      this.filtrosVistaInicial = { ...state.filtros };

      this.paginacion = state.paginacion;
      this.totalDatos = this.paginacion.total;

      this.totalPaginas = this.paginacion.last_page || 1;
      this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
      this.paginaActual = this.filtrosVistaInicial.page || 1;

      this.inmueblesService.setPropiedades(this.resultados);

      await this.getCiudades();

      if (this.filtrosVistaInicial) {
        this.inicializarFiltrosDesdeVistaInicial();
        console.log('Filtros inicializados:', this.filtrosVistaInicial);
      }

      this.generarPaginas();
      this.cdRef.detectChanges();
    }
  }

  enviarFiltros(pagina: number = 1) {
    this.cargando = true;
    this.paginaActual = pagina;
    this.prepararFiltros();

    const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);
    console.log('filtrosObj', filtrosObj);
    const obj = {
      ...filtrosObj,
      page: pagina,
    };

    console.log('Obj', obj);

    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        console.log('response', response);

        this.resultados = response.data;
        this.totalDatos = response.total;

        this.paginacion = response;
        this.totalPaginas = response.last_page || 1;
        this.paginas = Array.from(
          { length: this.totalPaginas },
          (_, i) => i + 1
        );

        this.generarPaginas();
        this.cargando = false;

        if (this.isMobileView) {
          this.isDrawerOpen = false;
          console.log('Drawer cerrado en vista móvil');
        }
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  prepararFiltros() {
    const skipUbicacion =
      this.filtrosSeleccionados.get('isManualSelection') === 'true';
    this.filtrosSeleccionados.delete('isManualSelection');

    if (!skipUbicacion) {
      const limpiarTexto = (texto: string) => {
        return (
          texto
            ?.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toLowerCase() || ''
        );
      };

      const ubicacionValue = this.ubicacion;

      if (ubicacionValue) {
        // Buscar en barrios primero
        if (this.barrios?.data) {
          const barrioEncontrado = this.barrios.data.find(
            (b) =>
              limpiarTexto(`${b.city_name},${b.name}`) ===
              limpiarTexto(ubicacionValue)
          );

          if (barrioEncontrado) {
            this.filtrosSeleccionados.set('city', barrioEncontrado.city_code);
            this.filtrosSeleccionados.set(
              'neighborhood_code',
              barrioEncontrado.code
            );
          }
        }

        // Buscar en ciudades si no se encontró en barrios
        if (!this.filtrosSeleccionados.has('city')) {
          const ciudad = this.ciudades.find(
            (c) => limpiarTexto(c.name) === limpiarTexto(ubicacionValue)
          );
          this.filtrosSeleccionados.set('city', ciudad?.code);
          this.filtrosSeleccionados.delete('neighborhood_code');
        }
      } else {
        this.filtrosSeleccionados.delete('city');
        this.filtrosSeleccionados.delete('neighborhood_code');
      }
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
        this.filtrosSeleccionados.set('maxbedroom', 100);
        this.filtrosSeleccionados.set('minbedroom', 6);
      } else {
        this.filtrosSeleccionados.set('bedrooms', values.join(','));
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

    if (this.formRangos.value.AreaMinima) {
      this.filtrosSeleccionados.set(
        'minarea',
        this.formRangos.value.AreaMinima
      );
    }

    if (this.formRangos.value.AreaMaxima) {
      this.filtrosSeleccionados.set(
        'maxarea',
        this.formRangos.value.AreaMaxima
      );
    }

    const precioMinimo = this.formRangos.value.precioMinimo;
    const precioMaximo = this.formRangos.value.precioMaximo;

    if (precioMinimo && precioMinimo !== '') {
      this.filtrosSeleccionados.set('pcmin', precioMinimo);
    } else {
      this.filtrosSeleccionados.delete('pcmin');
    }

    if (precioMaximo && precioMaximo !== '') {
      this.filtrosSeleccionados.set('pcmax', precioMaximo);
    } else {
      this.filtrosSeleccionados.delete('pcmax');
    }

    const precioVentaMinimo = this.formRangos.value.precioVentaMinimo;
    const precioVentaMaximo = this.formRangos.value.precioVentaMaximo;

    if (precioVentaMinimo && precioVentaMinimo !== '') {
      this.filtrosSeleccionados.set('pvmin', precioVentaMinimo);
    } else {
      this.filtrosSeleccionados.delete('pvmin');
    }

    if (precioVentaMaximo && precioVentaMaximo !== '') {
      this.filtrosSeleccionados.set('pvmax', precioVentaMaximo);
    } else {
      this.filtrosSeleccionados.delete('pvmax');
    }
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

  selectPriceRange(range: { min: number, max: number | null }): void {
    console.log('rango', range);
    if (this.selectedPriceRange?.min === range.min) {
      this.selectedPriceRange = null;
      this.formRangos.patchValue({
        precioMinimo: null,
        precioMaximo: null
      });
      this.filtrosSeleccionados.delete('pcmin');
      this.filtrosSeleccionados.delete('pcmax');
    } else {
      this.selectedPriceRange = range;
      this.formRangos.patchValue({
        precioMinimo: range.min.toString(),
        precioMaximo: range.max ? range.max.toString() : null
      });
      this.filtrosSeleccionados.set('pcmin', range.min.toString());

      if (range.max !== null) {
        this.filtrosSeleccionados.set('pcmax', range.max.toString());
      } else {
        this.filtrosSeleccionados.delete('pcmax');
      }
    }
    this.cdRef.detectChanges();
  }

  seleccionar(categoria: keyof typeof this.seleccion, valor: number | string) {
    const arr = this.seleccion[categoria] as (number | string)[];
    const index = arr.indexOf(valor);
    index > -1 ? arr.splice(index, 1) : arr.push(valor);
  }

  isEstateSelected(option: any): boolean {
    return this.selectedEstates.some((o) => o.code === option.code);
  }

  filterLocations() {
    const search = this.searchTerm.toLowerCase().trim();

    // Filtrar ciudades que coinciden
    const ciudadesFiltradas = this.ciudades.filter((ciudad) =>
      ciudad.name.toLowerCase().includes(search)
    );

    // Filtrar barrios que coinciden con la ciudad o nombre
    const barriosFiltrados = this.barrios.data.filter(
      (barrio: any) =>
        barrio.city_name.toLowerCase().includes(search) ||
        barrio.name.toLowerCase().includes(search)
    );

    // Combinar resultados y eliminar duplicados
    this.filteredBarrios = [
      ...ciudadesFiltradas.map((c) => ({ ...c, isCity: true })),
      ...barriosFiltrados,
    ].filter(
      (item, index, self) =>
        index ===
        self.findIndex((i) =>
          i.isCity ? i.code === item.code : i.code === item.code
        )
    );

    // Ordenar: ciudades primero, luego barrios de las ciudades encontradas
    this.filteredBarrios.sort((a: any, b: any) => {
      if (a.isCity && !b.isCity) return -1;
      if (!a.isCity && b.isCity) return 1;
      return 0;
    });
  }

  selectLocation(item: any) {
    if (item.isCity) {
      // Selección de ciudad
      this.searchTerm = item.name;
      this.filtrosSeleccionados.set('city', item.code);
      this.filtrosSeleccionados.delete('neighborhood_code');
    } else {
      // Selección de barrio
      this.searchTerm = `${item.city_name}, ${item.name}`;
      this.filtrosSeleccionados.set('city', item.city_code);
      this.filtrosSeleccionados.set('neighborhood_code', item.code);
    }

    this.filteredBarrios = [];
    this.ubicacion = this.searchTerm;
    this.filtrosSeleccionados.set('isManualSelection', 'true');
    if (this.searchTerm != '') {
      this.enviarFiltros();
    }
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

  borrarFiltros() {
    this.filtrosSeleccionados.clear();
    this.selectedPriceRange = null;

    this.seleccion = {
      habitaciones: [],
      banos: [],
      parqueadero: [],
      estrato: [],
    };

    this.formRangos.patchValue({
      AreaMinima: null,
      AreaMaxima: null,
      precioMinimo: null,
      precioMaximo: null,
      precioVentaMinimo: null,
      precioVentaMaximo: null,
    });

    this.cdRef.detectChanges();

    this.enviarFiltros();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredBarrios = [];
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
      },
      (error: any) => {
        console.error('Error al obtener las ciudades:', error);
      }
    );
  }

  getBarrios() {
    this.inmueblesService.getBarrios().subscribe(
      (data: any) => {
        this.barrios = data;
        console.log('Barrios:', this.barrios);
      },
      (error: any) => {
        console.log(error);
        console.error('Error al obtener los barrios:', error);
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
    const url = this.router.createUrlTree(['/ver-propiedad', codPro]).toString();
    this.router.navigate(['/ver-propiedad', codPro]);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
