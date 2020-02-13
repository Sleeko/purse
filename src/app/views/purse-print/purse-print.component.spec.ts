import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PursePrintComponent } from './purse-print.component';

describe('PursePrintComponent', () => {
  let component: PursePrintComponent;
  let fixture: ComponentFixture<PursePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PursePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PursePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
