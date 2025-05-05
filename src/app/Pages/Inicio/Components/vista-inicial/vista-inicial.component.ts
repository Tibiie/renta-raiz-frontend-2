import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { BotonesFlotantesComponent } from '../../../../shared/botones-flotantes/botones-flotantes.component';
import { BarraFiltrosComponent } from '../../../../shared/barra-filtros/barra-filtros.component';

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
    'assets/images/vistaInicial-slider-1.jpg',
    'assets/images/vistaInicial-slider-2.jpg',
    'assets/images/vistaInicial-slider-3.jpg',
    'assets/images/vistaInicial-slider-4.jpg',
    'assets/images/vistaInicial-slider-5.jpg',
    'assets/images/vistaInicial-slider-6.jpg',
  ];

  cargando = false;
  isLoading = true;

  // Injectaciones
  router = inject(Router);
  elementRef = inject(ElementRef);
  formBuilder = inject(FormBuilder);
  inmueblesService = inject(InmueblesService);

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

  // scrollToTop(): void {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth',
  //   });
  // }

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
        this.inmueblesVentasArray = [
          response.data[0],
          response.data[2],
          response.data[3],
        ];
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

  redirigirVerBlog(id: number) {
    const url = this.router.createUrlTree(['/ver-blog', id]).toString();
    window.open(url, '_blank');
  }

  redirigirAvaluosComerciales() {
    const url = this.router.createUrlTree(['/avaluos-comerciales']).toString();
    window.open(url, '_blank');
  }

  redirigirFiltros() {
    this.cargando = true;
    this.filtrosSeleccionados.clear();
    this.filtrosSeleccionados.set('biz', '3');

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
    const grupoSize = 4;
    this.aliadosPorGrupo = [];

    for (let i = 0; i <= this.aliados.length - grupoSize; i++) {
      this.aliadosPorGrupo.push(this.aliados.slice(i, i + grupoSize));
    }

    console.log(this.aliadosPorGrupo);
  }

  abrirPestana(url: string) {
    window.open(url, '_blank');
  }

  verPropiedad(codPro: number) {
    const url = this.router
      .createUrlTree(['/ver-propiedad', codPro])
      .toString();
    window.open(url, '_blank');
  }

  abrirBrochure() {
    const url = 'https://oferta.rentaraiz.co/flipbook/brochure-renta-raiz/';
    window.open(url, '_blank');
  }
}
