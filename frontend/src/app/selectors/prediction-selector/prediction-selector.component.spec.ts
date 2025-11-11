import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionSelectorComponent } from './prediction-selector.component';

describe('PredictionSelectorComponent', () => {
  let component: PredictionSelectorComponent;
  let fixture: ComponentFixture<PredictionSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredictionSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PredictionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
