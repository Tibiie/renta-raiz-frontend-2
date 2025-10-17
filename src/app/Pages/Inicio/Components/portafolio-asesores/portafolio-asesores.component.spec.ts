import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortafolioAsesoresComponent } from './portafolio-asesores.component';

describe('PortafolioAsesoresComponent', () => {
  let component: PortafolioAsesoresComponent;
  let fixture: ComponentFixture<PortafolioAsesoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortafolioAsesoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PortafolioAsesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
