import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProductoComponent } from './detail-producto.component';

describe('DetailProductoComponent', () => {
  let component: DetailProductoComponent;
  let fixture: ComponentFixture<DetailProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
