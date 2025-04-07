import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.scss'
})
export class FiltrosComponent implements OnInit {

  

  constructor() { }

  ngOnInit(): void {
  }

}
