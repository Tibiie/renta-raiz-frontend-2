import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPropiedadesComponent } from './formulario-propiedades.component';

describe('FormularioPropiedadesComponent', () => {
  let component: FormularioPropiedadesComponent;
  let fixture: ComponentFixture<FormularioPropiedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPropiedadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioPropiedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
