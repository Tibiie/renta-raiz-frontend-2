import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { filter } from 'rxjs/operators';

declare let fbq: Function; // Importante para que TypeScript no dé error

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  router = inject(Router);
  platformId = inject(PLATFORM_ID);


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            initFlowbite();
          }, 100);
        }
      });
    }



    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        fbq('track', 'PageView'); // ← Aquí disparas el evento de página vista
      });


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = new URL(window.location.href);

        // Paso 1: guardar en localStorage si están en la URL
        const utmParams = ['utm_source', 'utm_medium', 'utm_id', 'fbclid'];

        let updated = false;

        utmParams.forEach(param => {
          const value = url.searchParams.get(param);
          if (value) {
            localStorage.setItem(param, value);
          }
        });

        // Paso 2: agregar desde localStorage si faltan en la URL
        utmParams.forEach(param => {
          const localValue = localStorage.getItem(param);
          if (localValue && !url.searchParams.has(param)) {
            url.searchParams.set(param, localValue);
            updated = true;
          }
        });

        if (updated) {
          window.history.replaceState(
            window.history.state,
            '',
            url.toString()
          );
        }
      }
    });
  }
}
