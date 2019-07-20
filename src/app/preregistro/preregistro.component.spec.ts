import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreregistroComponent } from './preregistro.component';

describe('PreregistroComponent', () => {
  let component: PreregistroComponent;
  let fixture: ComponentFixture<PreregistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreregistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreregistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
