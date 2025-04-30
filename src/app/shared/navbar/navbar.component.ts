import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, Input, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('nosotrosDropdown') nosotrosDropdownRef: ElementRef | undefined;
  @ViewChild('arriendosDropdown') arriendosDropdownRef: ElementRef | undefined;
  @ViewChild('clientesDropdown') clientesDropdownRef: ElementRef | undefined;

  isScrolled = false;
  elementsPerPage = 12;
  showNosotrosDropdown = false;
  showClientesDropdown = false;
  showArriendosDropdown = false;
  showDestacadosDropdown = false;
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

  toggleArriendosDropdown(event: MouseEvent) {
    event.preventDefault();
    this.showArriendosDropdown = !this.showArriendosDropdown;
  }

  toggleClientesDropdown(event: MouseEvent) {
    event.preventDefault();
    this.showClientesDropdown = !this.showClientesDropdown;
  }

  toggleDestacadosDropdown(event: MouseEvent) {
    event.preventDefault();
    this.showDestacadosDropdown = !this.showDestacadosDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isMobileMenuOpen) return;

    const target = event.target as HTMLElement;

    const clickedInsideArriendos =
      this.arriendosDropdownRef?.nativeElement.contains(target) ||
      target.closest('a')?.textContent?.includes('Arriendo');

    const clickedInsideNosotros =
      this.nosotrosDropdownRef?.nativeElement.contains(target) ||
      target.closest('a')?.textContent?.includes('Nosotros');

    const clickedInsideClientes =
      this.clientesDropdownRef?.nativeElement.contains(target) ||
      target.closest('a')?.textContent?.includes('Clientes');

    if (!clickedInsideArriendos) this.showArriendosDropdown = false;
    if (!clickedInsideNosotros) this.showNosotrosDropdown = false;
    if (!clickedInsideClientes) this.showClientesDropdown = false;
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
    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate(['/filtros'], {
            state: {
              resultados: response.data,
              paginacion: response,
              filtros: obj,
            },
          });
        });
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }

  enviarFiltroArriendo(tipo: string) {
    this.filtrosInmueblesArriendo.clear();

    if (tipo === 'diamante') {
      this.filtrosInmueblesArriendo.set('pcmin', 15000000);
    } else if (tipo === 'oro') {
      this.filtrosInmueblesArriendo.set('pcmin', 8000000);
      this.filtrosInmueblesArriendo.set('pcmax', 15000000);
    } else if (tipo === 'plata') {
      this.filtrosInmueblesArriendo.set('pcmin', 2000000);
      this.filtrosInmueblesArriendo.set('pcmax', 8000000);
    }
    this.filtrosInmueblesArriendo.set('biz', '1');

    const filtrosObj = Object.fromEntries(this.filtrosInmueblesArriendo);
    const obj = {
      ...filtrosObj,
      page: 1,
    }

    console.log('filtros enviados:', obj);

    this.inmueblesService.getFiltrosEnviar(obj, this.elementsPerPage).subscribe(
      (response: any) => {
        this._router.navigate(['/filtros', tipo], {
          state: {
            resultados: response.data,
            paginacion: response,
            filtros: obj,
          },
          skipLocationChange: false
        });
      },
      (error: any) => {
        console.error('Error al enviar los filtros:', error);
      }
    );
  }
}