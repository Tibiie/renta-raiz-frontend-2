import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticarPrivacidadComponent } from './politicar-privacidad.component';

describe('PoliticarPrivacidadComponent', () => {
  let component: PoliticarPrivacidadComponent;
  let fixture: ComponentFixture<PoliticarPrivacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticarPrivacidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliticarPrivacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
