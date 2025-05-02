import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaluosComercialesComponent } from './avaluos-comerciales.component';

describe('AvaluosComercialesComponent', () => {
  let component: AvaluosComercialesComponent;
  let fixture: ComponentFixture<AvaluosComercialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaluosComercialesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvaluosComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
