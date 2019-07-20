import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedUserComponent } from './verified-user.component';

describe('VerifiedUserComponent', () => {
  let component: VerifiedUserComponent;
  let fixture: ComponentFixture<VerifiedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifiedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
