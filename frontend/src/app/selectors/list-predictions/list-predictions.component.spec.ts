import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPredictionsComponent } from './list-predictions.component';

describe('ListPredictionsComponent', () => {
  let component: ListPredictionsComponent;
  let fixture: ComponentFixture<ListPredictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPredictionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
