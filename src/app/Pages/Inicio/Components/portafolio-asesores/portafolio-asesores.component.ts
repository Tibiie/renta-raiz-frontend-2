import { Component, inject, OnInit } from '@angular/core';
import { Router } from 'express';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { NavbarComponent2 } from '../../../../shared/navbar-2/navbar-2.component';


@Component({
  selector: 'app-portafolio-asesores',
  standalone: true,
  imports: [CommonModule, NavbarComponent2],
  templateUrl: './portafolio-asesores.component.html',
  styleUrl: './portafolio-asesores.component.scss'
})
export class PortafolioAsesoresComponent implements OnInit {

    mostrarContenido = false;
  asesorId!: string;
  filtrosSeleccionados: Map<string, any> = new Map();
  totalDatos = 0;
  totalPaginas = 0;
  paginaActual: number = 1;
  elementsPerPage = 12;
  bloqueActual: number = 0;
  loadingResultados: boolean = false;
  isDrawerOpen: boolean = false;
  resultados: any[] = [];
  paginas: (number | string)[] = [];


   activatedRoute = inject(ActivatedRoute);
  // router = inject(Router);
   inmubeService = inject(InmueblesService);



  ngOnInit(): void {
    
     this.asesorId = this.activatedRoute.snapshot.paramMap.get('asesor')!;
     
     this.obtenerPropiedades(Number(this.asesorId), 1);
  }



  verPropiedad(codPro: number) {
    // this.router.navigate(['/ver-propiedad', codPro, 0]).then(() => {
    //   window.scrollTo(0, 0); // opcional: para que siempre inicie arriba
    // });
  }


  obtenerPropiedades(asesorID: number, page: number) {
    this.filtrosSeleccionados.set('broker', asesorID);
    

     const filtrosObj = Object.fromEntries(this.filtrosSeleccionados);

     
      const obj = {
        ...filtrosObj,
        page: page,
      };
      console.log(obj);
      
   
    this.inmubeService.getFiltrosEnviar(obj, 12).subscribe(
      (data: any) => {
        this.resultados = data.data;
        console.log(this.resultados);
      },
      (error: any) => {
        console.error('Error al obtener las propiedades:', error);
      }
    );
  }


  generarPaginas() {
    this.paginas = [];
    const paginasPorBloque = 3;
    const inicio = this.bloqueActual * paginasPorBloque + 1;
    const fin = Math.min(inicio + paginasPorBloque - 1, this.totalPaginas);

    for (let i = inicio; i <= fin; i++) {
      this.paginas.push(i);
    }

    if (fin < this.totalPaginas - 1) {
      this.paginas.push('...');
    }

    if (this.totalPaginas > 1 && !this.paginas.includes(this.totalPaginas)) {
      this.paginas.push(this.totalPaginas);
    }

    console.log(this.paginas);
  }

  irAlSiguienteBloque() {
    const maxBloques = Math.floor((this.totalPaginas - 1) / 3);
    console.log(this.bloqueActual < maxBloques);
    console.log(this.bloqueActual);


    if (this.bloqueActual < maxBloques) {
      console.log('bloque sig');

      this.bloqueActual++;
      this.generarPaginas();
    }
  }

  irAlBloqueAnterior() {
    const paginasPorBloque = 3;
    console.log('bloque ant');

    if (this.bloqueActual > 0) {
      const nuevoBloque = this.bloqueActual - 1;
      const inicioNuevoBloque = nuevoBloque * paginasPorBloque + 1;
      const finNuevoBloque = Math.min(
        inicioNuevoBloque + paginasPorBloque - 1,
        this.totalPaginas
      );

      if (this.paginaActual >= inicioNuevoBloque) {
        this.bloqueActual = nuevoBloque;
      } else {
        this.bloqueActual = nuevoBloque;
        this.paginaActual = finNuevoBloque;
      }

      this.generarPaginas();

    }
  }

  cambiarPagina(pagina: number | string) {
    console.log(pagina);
    console.log('primer elemento', this.paginas[0]);
    console.log('pagina', this.paginaActual);


    if (pagina === '...') {
      this.irAlSiguienteBloque();
      return;
    }

    if (typeof pagina === 'number') {

      const primerElemento = this.paginas[0];

      if (typeof primerElemento === 'number' && this.paginaActual < primerElemento) {
        this.irAlBloqueAnterior();
        return;
      }

      console.log(typeof pagina);


      const nuevoBloque = Math.floor((pagina - 1) / 3);
      if (nuevoBloque !== this.bloqueActual) {

        this.bloqueActual = nuevoBloque;
        this.generarPaginas();
      }

      // var queryParams = this.activatedRoute.snapshot.queryParams;
      // const state = window.history.state;
      // console.log(state)

      // console.log();

      // if (Object.keys(queryParams).length >= 1 && !queryParams['tipo']) {



      // } else {
      //   console.log('no hay params');

      // }
    }
  }


  paginaAnterior() {
    if (this.paginaActual > 1) {
      const nuevaPagina = this.paginaActual - 1;
      const paginasPorBloque = 3;
      const nuevoBloque = Math.floor((nuevaPagina - 1) / paginasPorBloque);

      if (nuevoBloque !== this.bloqueActual) {
        this.bloqueActual = nuevoBloque;
        this.generarPaginas();
      }

    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      const nuevaPagina = this.paginaActual + 1;
      // var queryParams = this.activatedRoute.snapshot.queryParams;
      // const state = window.history.state;

      // if (Object.keys(queryParams).length >= 1) {
      //   this.paginaActual = nuevaPagina;





      // } else {

      // }

      const paginasPorBloque = 3;
      const bloqueActual = Math.floor((nuevaPagina - 1) / paginasPorBloque);

      if (bloqueActual !== this.bloqueActual) {
        this.bloqueActual = bloqueActual;
        this.generarPaginas();
      }

    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

}
