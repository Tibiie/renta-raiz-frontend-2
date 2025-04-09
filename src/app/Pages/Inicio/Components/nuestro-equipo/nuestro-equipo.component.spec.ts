import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuestroEquipoComponent } from './nuestro-equipo.component';

describe('NuestroEquipoComponent', () => {
  let component: NuestroEquipoComponent;
  let fixture: ComponentFixture<NuestroEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuestroEquipoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuestroEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
