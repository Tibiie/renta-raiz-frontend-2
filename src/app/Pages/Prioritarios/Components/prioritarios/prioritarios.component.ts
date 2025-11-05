import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { CommonModule } from '@angular/common';
import { CategoryEnum } from '../../../../core/enums/CategoryEnum';
import { TipoPropiedadEnum } from '../../../../core/enums/TipoPropiedadEnum';
import { NavbarComponent2 } from '../../../../shared/navbar-2/navbar-2.component';
import { catchError, forkJoin, of } from 'rxjs';
import { BarraFiltrosComponent } from '../../../../shared/barra-filtros/barra-filtros.component';

@Component({
  selector: 'app-prioritarios',
  standalone: true,
  imports: [CommonModule, NavbarComponent2,  BarraFiltrosComponent],
  templateUrl: './prioritarios.component.html',
  styleUrl: './prioritarios.component.scss'
})
export class PrioritariosComponent implements OnInit {


  reference = {
    code: "4026"
  }

  type: string = "";

  paramsFilter: any = {
    oro: "",
    plata: "",
    diamante: ""
  };



  paginacionVenta: any = {};

  mostrarContenido = false;
  asesorId!: string;
  filtrosSeleccionadosOro: Map<string, any> = new Map();
  filtrosSeleccionadosPlata: Map<string, any> = new Map();
  filtrosSeleccionadosDiamante: Map<string, any> = new Map();
  totalDatosVenta = 0;

  totalPaginasVenta = 0;

  paginaActualVenta: number = 1;

  elementsPerPage = 12;
  bloqueActualVenta: number = 0;


  inmueblesVisiblesVenta: any[] = [];
  loadingResultadosVenta: boolean = false;

  isDrawerOpen: boolean = false;
  resultados: any[] = [];

  paginasVenta: (number | string)[] = [];

  isSmallScreen = false;

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  // router = inject(Router);
  inmubeService = inject(InmueblesService);




  ngOnInit(): void {

    const queryParams = this.activatedRoute.snapshot.queryParams;
    // if (queryParams['category'] ) {


    //   this.getCategory(queryParams['category'], queryParams['biz']);
    //   console.log(this.filtrosSeleccionados);



    // }

    if (queryParams['biz']) {
      this.getBiz(queryParams['biz']);
    }


    this.obtenerInmuebles(this.elementsPerPage, 1);
  }

  verPropiedad(codPro: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/ver-propiedad', codPro, 1])
    );
    window.open(url, '_blank');
  }

  getBiz(type: string) {
    this.filtrosSeleccionadosOro.set('biz', TipoPropiedadEnum.VENTA);
    this.filtrosSeleccionadosOro.set('reference', this.reference.code);
    this.filtrosSeleccionadosDiamante.set('biz', TipoPropiedadEnum.VENTA);
    this.filtrosSeleccionadosOro.set('reference', this.reference.code);
    this.filtrosSeleccionadosPlata.set('biz', TipoPropiedadEnum.VENTA);
    this.filtrosSeleccionadosOro.set('reference', this.reference.code);



    if (type === TipoPropiedadEnum.VENTA) {
      this.type = "Venta";

      //oro
      this.filtrosSeleccionadosOro.set('pvmin', 1000000001);
      this.filtrosSeleccionadosOro.set('pvmax', 2000000000);

      //plata
      this.filtrosSeleccionadosPlata.set('pvmin', 100000000);
      this.filtrosSeleccionadosPlata.set('pvmax', 1000000000);

      //diamante
      this.filtrosSeleccionadosDiamante.set('pvmin', 2000000000);
      this.filtrosSeleccionadosDiamante.set('pvmax', 100000000000);
    }


    if (type === TipoPropiedadEnum.ARRIENDO) {
      this.type = "Arriendo";
      //oro
      this.filtrosSeleccionadosOro.set('pcmin', 8000000);
      this.filtrosSeleccionadosOro.set('pcmax', 15000000);

      //plata
      this.filtrosSeleccionadosPlata.set('pcmin', 2000000);
      this.filtrosSeleccionadosPlata.set('pcmax', 8000000);

      //diamante
      this.filtrosSeleccionadosDiamante.set('pcmin', 15000000);
      this.filtrosSeleccionadosDiamante.set('pcmax', 100000000000);
    }

    this.paramsFilter.oro = this.filtrosSeleccionadosOro;
    this.paramsFilter.plata = this.filtrosSeleccionadosPlata;
    this.paramsFilter.diamante = this.filtrosSeleccionadosDiamante;


  }




  obtenerInmuebles(elementsPerPage: number, page: number) {


    //oro
    const filtrosObjOro = Object.fromEntries(this.filtrosSeleccionadosOro);
    const objOro = {
      ...filtrosObjOro,
      page: page,
    };

    //plata
    const filtrosObjPlata = Object.fromEntries(this.filtrosSeleccionadosPlata);
    const objPlata = {
      ...filtrosObjPlata,
      page: page,
    };

    //diamante
    const filtrosObjDiamante = Object.fromEntries(this.filtrosSeleccionadosDiamante);
    const objDiamante = {
      ...filtrosObjDiamante,
      page: page,
    };






    forkJoin({
      oro: this.inmubeService.getFiltrosEnviar(objOro, elementsPerPage).pipe(
        catchError(err => {
          console.error('Error al cargar usuarios:', err);
          return of([] as any[]);
        })
      ),
      plata: this.inmubeService.getFiltrosEnviar(objPlata, elementsPerPage).pipe(
        catchError(err => {
          console.error('Error al cargar productos:', err);
          return of([] as any[]);
        })
      ),
      diamante: this.inmubeService.getFiltrosEnviar(objDiamante, elementsPerPage).pipe(
        catchError(err => {
          console.error('Error al cargar pedidos:', err);
          return of([] as any[]);
        })
      )
    }).subscribe({
      next: ({ oro, plata, diamante }) => {

        var resultOro ={
          type: "Oro",
          data: oro
        }
        this.resultados.push(resultOro);

        var resultPlata ={
          type: "Plata",
          data: plata
        }
        this.resultados.push(resultPlata);

        var resultDiamante ={
          type: "Diamante",
          data: diamante
        }
        this.resultados.push(resultDiamante);

       
        console.log('✅ Datos cargados correctamente:', { oro, plata, diamante });
        console.log(this.resultados);
        
      },
      error: (err) => {
        console.error('❌ Error general:', err);
      }
    });

    // this.inmubeService.getFiltrosEnviar(obj, elementsPerPage).subscribe(
    //   (data: any) => {
    //     this.resultadosVenta = data.data;

    //     this.totalDatosVenta = data.total;
    //     this.paginaActualVenta = data.current_page || 1;
    //     this.paginacionVenta = data;
    //     this.totalPaginasVenta = data.last_page || 1;
    //     this.paginasVenta = Array.from(
    //       { length: this.totalPaginasVenta },
    //       (_, i) => i + 1
    //     );



    //     this.generarPaginas();
    //     console.log(this.resultadosVenta);
    //     // this.loadingResultadosVenta = false
    //   },
    //   (error: any) => {
    //     console.error('Error al obtener las propiedades:', error);
    //   }
    // );


  }


  generarPaginas() {

  }

  irAlSiguienteBloque(tipo: string) {


  }

  irAlBloqueAnterior(tipo: string) {

  }

  cambiarPagina(pagina: number | string, tipo: string) {


  }


  paginaAnterior(tipo: string) {

  }

  paginaSiguiente(tipo: string) {


  }

}
