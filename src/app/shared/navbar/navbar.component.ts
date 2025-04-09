import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Input() alwaysScrolled = false;
  isScrolled = false;
  isMobileMenuOpen: boolean = false;

  ngOnInit(): void {
    if (this.alwaysScrolled) {
      this.isScrolled = true;
    }
  }

  constructor(private _router: Router) { }

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

  showNosotrosDropdown = false;

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