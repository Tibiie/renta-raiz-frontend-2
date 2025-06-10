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
        const utmSourceLocal = localStorage.getItem('utm_source');
        const fbclidLocal = localStorage.getItem('fbclid');

        if (utmSourceLocal && !url.searchParams.has('utm_source')) {
          // Agrega utm_source sin perder el state
          url.searchParams.set('utm_source', utmSourceLocal);

          if (fbclidLocal && !url.searchParams.has('fbclid')) {
            // Agrega utm_source sin perder el state
            url.searchParams.set('fbclid', fbclidLocal);


          }
          // Mantiene el mismo state
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
