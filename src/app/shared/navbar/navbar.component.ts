import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InmueblesService } from '../../core/Inmuebles/inmuebles.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  elementsPerPage = 12;
  showNosotrosDropdown = false;
  showClientesDropdown = false;
  @Input() alwaysScrolled = false;
  isMobileMenuOpen: boolean = false;

  filtrosInmueblesVenta: Map<string, any> = new Map();
  filtrosInmueblesArriendo: Map<string, any> = new Map();
  filtrosInmueblesDestacados: Map<string, any> = new Map();

  // Injecciones
  _router = inject(Router);
  inmueblesService = inject(InmueblesService);

  ngOnInit(): void {
    if (this.alwaysScrolled) {
      this.isScrolled = true;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.alwaysScrolled) {
      this.isScrolled = window.scrollY > 50;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  redirectTo(url: string): void {
    this._router.navigate([url]);
  }

  toggleNosotrosDropdown(event: MouseEvent) {
    event.preventDefault();
    this.showNosotrosDropdown = !this.showNosotrosDropdown;
  }

  toggleClientesDropdown(event: MouseEvent) {
    event.preventDefault();
    this.showClientesDropdown = !this.showClientesDropdown;
  }

  closeDropdown() {
    this.showNosotrosDropdown = false;
  }

  navigateTo(route: string) {
    this._router.navigate([route]);
    this.closeDropdown();
  }

  enviarFiltroVenta() {
    this.filtrosInmueblesVenta.clear();
    this.filtrosInmueblesVenta.set('biz', '2');

    const filtrosObj = Object.fromEntries(this.filtrosInmueblesVenta);
    const obj = {
      ...filtrosObj,
      page: 1,
    }
    console.log('Objeto a enviar:', obj);
    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        console.log("filtros", response.data);
        this._router.navigate(['/filtros'], {
          state: { resultados: response.data, paginacion: response, filtros: obj }
        });
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  enviarFiltroArriendo() {
    this.filtrosInmueblesArriendo.clear();
    this.filtrosInmueblesArriendo.set('biz', '1');

    const filtrosObj = Object.fromEntries(this.filtrosInmueblesArriendo);
    const obj = {
      ...filtrosObj,
      page: 1,
    }
    console.log('Objeto a enviar:', obj);
    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        console.log("filtros", response.data);
        this._router.navigate(['/filtros'], {
          state: { resultados: response.data, paginacion: response, filtros: obj }
        });
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  enviarFiltroDestacados() {
    this.filtrosInmueblesDestacados.clear();
    this.filtrosInmueblesDestacados.set('biz', '1');

    const filtrosObj = Object.fromEntries(this.filtrosInmueblesDestacados);
    const obj = {
      ...filtrosObj,
      page: 1,
    }
    console.log('Objeto a enviar:', obj);
    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        console.log("filtros", response.data);
        this._router.navigate(['/filtros'], {
          state: { resultados: response.data, paginacion: response, filtros: obj }
        });
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }
}