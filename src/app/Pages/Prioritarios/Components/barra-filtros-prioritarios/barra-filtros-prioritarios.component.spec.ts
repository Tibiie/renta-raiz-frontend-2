import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraFiltrosPrioritariosComponent } from './barra-filtros-prioritarios.component';

describe('BarraFiltrosPrioritariosComponent', () => {
  let component: BarraFiltrosPrioritariosComponent;
  let fixture: ComponentFixture<BarraFiltrosPrioritariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraFiltrosPrioritariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarraFiltrosPrioritariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
