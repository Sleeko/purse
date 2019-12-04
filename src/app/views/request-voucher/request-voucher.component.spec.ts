import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestVoucherComponent } from './request-voucher.component';

describe('RequestVoucherComponent', () => {
  let component: RequestVoucherComponent;
  let fixture: ComponentFixture<RequestVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
