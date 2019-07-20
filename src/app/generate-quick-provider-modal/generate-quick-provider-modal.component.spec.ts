import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateQuickProviderModalComponent } from './generate-quick-provider-modal.component';

describe('GenerateQuickProviderModalComponent', () => {
  let component: GenerateQuickProviderModalComponent;
  let fixture: ComponentFixture<GenerateQuickProviderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateQuickProviderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateQuickProviderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
