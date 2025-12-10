import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWishlistComponent } from './modal-wishlist.component';

describe('ModalWishlistComponent', () => {
  let component: ModalWishlistComponent;
  let fixture: ComponentFixture<ModalWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalWishlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
