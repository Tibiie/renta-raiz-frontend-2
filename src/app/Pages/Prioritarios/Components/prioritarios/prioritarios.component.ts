import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InmueblesService } from '../../../../core/Inmuebles/inmuebles.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prioritarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prioritarios.component.html',
  styleUrl: './prioritarios.component.scss'
})
export class PrioritariosComponent implements OnInit {
  



  paginacionVenta: any = {};

  mostrarContenido = false;
  asesorId!: string;
  filtrosSeleccionados: Map<string, any> = new Map();
  totalDatosVenta = 0;

  totalPaginasVenta = 0;

  paginaActualVenta: number = 1;

  elementsPerPage = 8;
  bloqueActualVenta: number = 0;


  inmueblesVisiblesVenta: any[] = [];
  loadingResultadosVenta: boolean = false;

  isDrawerOpen: boolean = false;
  resultadosVenta: any[] = [];

  paginasVenta: (number | string)[] = [];

  isSmallScreen = false;

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  // router = inject(Router);
  inmubeService = inject(InmueblesService);




  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  verPropiedad(codPro: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/ver-propiedad', codPro, 0])
    );
    window.open(url, '_blank');
  }


  
    generarPaginas(tipo: string) {
     
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
