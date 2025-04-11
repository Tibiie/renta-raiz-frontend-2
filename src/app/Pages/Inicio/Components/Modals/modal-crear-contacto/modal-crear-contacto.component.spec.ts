import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearContactoComponent } from './modal-crear-contacto.component';

describe('ModalCrearContactoComponent', () => {
  let component: ModalCrearContactoComponent;
  let fixture: ComponentFixture<ModalCrearContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearContactoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCrearContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
