import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioExitosoComponent } from './envio-exitoso.component';

describe('EnvioExitosoComponent', () => {
  let component: EnvioExitosoComponent;
  let fixture: ComponentFixture<EnvioExitosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvioExitosoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnvioExitosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
