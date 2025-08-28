import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioLayoutComponent } from './inicio-layout.component';

describe('InicioLayoutComponent', () => {
  let component: InicioLayoutComponent;
  let fixture: ComponentFixture<InicioLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
