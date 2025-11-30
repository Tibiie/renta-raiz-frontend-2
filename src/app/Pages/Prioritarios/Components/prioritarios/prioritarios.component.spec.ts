import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioritariosComponent } from './prioritarios.component';

describe('PrioritariosComponent', () => {
  let component: PrioritariosComponent;
  let fixture: ComponentFixture<PrioritariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrioritariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrioritariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
