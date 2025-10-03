import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaAcosoComponent } from './politica-acoso.component';

describe('PoliticaAcosoComponent', () => {
  let component: PoliticaAcosoComponent;
  let fixture: ComponentFixture<PoliticaAcosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaAcosoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliticaAcosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
