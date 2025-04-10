import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  showNosotrosDropdown = false;
  @Input() alwaysScrolled = false;
  isMobileMenuOpen: boolean = false;

  // Injecciones
  _router = inject(Router);

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

  closeDropdown() {
    this.showNosotrosDropdown = false;
  }

  navigateTo(route: string) {
    this._router.navigate([route]);
    this.closeDropdown();
  }
}