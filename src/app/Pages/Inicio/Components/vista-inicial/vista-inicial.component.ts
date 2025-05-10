import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';
import { BarraFiltrosComponent } from '../../../../shared/barra-filtros/barra-filtros.component';
var document: any;
declare const Carousel: any;
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
    BarraFiltrosComponent,
  ],
  templateUrl: './vista-inicial.component.html',
  styleUrls: ['./vista-inicial.component.scss'],
})
export class VistaInicialComponent implements OnInit, AfterViewInit {
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
  aliadosPorGrupo: string[][] = [];
  inmueblesVentasArray: any[] = [];
  inmueblesDestacadosArray: any = {};
  inmueblesArriendosArray: any[] = [];

  aliados: string[] = [
    'assets/images/sura.png',
    'assets/images/experian.png',
    'assets/images/fianzacredito.png',
    'assets/images/libertador.png',
    'assets/images/lonja.png',
    'assets/images/finca-raiz.png',
    'assets/images/metro-cuadrado.png',
    'assets/images/signio.png',
    'assets/images/Unifianza.png',
  ];

  sliderFotos: string[] = [
    'assets/images/vistaInicial-slider-1.png',
    'assets/images/vistaInicial-slider-2.png',
    'assets/images/vistaInicial-slider-3.png',
  ];

  cargando = false;
  isLoading = true;

  // Injectaciones
  router = inject(Router);
  elementRef = inject(ElementRef);
  formBuilder = inject(FormBuilder);
  inmueblesService = inject(InmueblesService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    const targetEl = document.getElementById('slider');
    if (targetEl) {
      new Carousel(targetEl, {
        interval: 3000,
        ride: 'carousel',
      });
    }
  }

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    this.getAliadosPorGrupo();
    this.getInmueblesVentas();
    this.getInmueblesArriendos();
    this.getInmueblesDestacados();
  }

  getInmueblesVentas() {
    this.filtrosInmueblesVenta.clear();
    this.filtrosInmueblesVenta.set('biz', 2);

    const filtrosObj = Object.fromEntries(this.filtrosInmueblesVenta);
    const obj = {
      ...filtrosObj,
      page: 2,
    };
    this.inmueblesService.getFiltrosEnviar(obj, 4).subscribe(
      (response: any) => {
        console.log(response.data);

        // this.inmueblesVentasArray = response.data.filter((inm:any)=> inm.image1 != "");

        var repuesta = [response.data[0], response.data[2], response.data[3]];

        console.log(repuesta);

        this.inmueblesVentasArray = repuesta.filter(
          (inm: any) => inm.images1 != ''
        );
        console.log(this.inmueblesVentasArray);
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
          var respuesta = response.data;

          this.inmueblesArriendosArray = [
            respuesta[0],
            respuesta[1],
            respuesta[2],
          ];
        },
        (error: any) => {
          console.error('Error al enviar los filtros:', error);
        }
      );
  }

  getInmueblesDestacados() {
    this.inmueblesService.getInmueblesDestacados().subscribe(
      (data: any) => {
        var respuesta = data.data.filter((inm: any) => inm.image1 != '');

        this.inmueblesDestacadosArray = [
          respuesta[0],
          respuesta[1],
          respuesta[2],
        ];
      },
      (error: any) => {
        console.log(error);

        console.error('Error al obtener los inmuebles:', error);
      }
    );
  }

  redirigirVerBlog(id: string) {
    const url = this.router.createUrlTree(['/ver-blog', id]).toString();
    window.open(url, '_blank');
  }

  redirigirAvaluosComerciales() {
    const url = this.router.createUrlTree(['/avaluos-comerciales']).toString();
    window.open(url, '_blank');
  }

  redirigirFiltros() {
    alert('filtros');
    this.cargando = true;
    this.filtrosSeleccionados.clear();
    this.filtrosSeleccionados.set('biz', '1');

    const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);
    const obj = {
      ...filtrosObj,
      page: 1,
    };

    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        this.router.navigate(['/filtros'], {
          state: {
            resultados: response.data,
            paginacion: response,
            filtros: obj,
          },
        });
        this.cargando = false;
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  redirigirPublicarPropiedad() {
    const url = this.router.createUrlTree(['/publicar-inmueble']).toString();
    window.open(url, '_blank');
  }

  getAliadosPorGrupo(): void {
    // Verificamos si estamos en el navegador antes de acceder a window
    const isMobile =
      isPlatformBrowser(this.platformId) && window.innerWidth < 768;
    const grupoSize = isMobile ? 3 : 4;
    console.log(isMobile);

    this.aliadosPorGrupo = [];

    // Agrupamos los aliados
    for (let i = 0; i <= this.aliados.length - grupoSize; i++) {
      this.aliadosPorGrupo.push(this.aliados.slice(i, i + grupoSize));
    }
    console.log(this.aliadosPorGrupo);
  }

  redirigirContactanos() {
    this.router.navigate(['/contacto']);
  }

  verPropiedad(codPro: number) {
    const url = this.router
      .createUrlTree(['/ver-propiedad', codPro])
      .toString();
    this.router.navigate(['/ver-propiedad', codPro]);
  }

  abrirBrochure() {
    const url = 'https://oferta.rentaraiz.co/flipbook/brochure-renta-raiz/';
    window.open(url, '_blank');
  }

  redirigirRentasCortas() {
    const url = 'https://nomalux.com.co';
    window.open(url, '_blank');
  }
}
