import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePredictionsComponent } from './game-predictions.component';

describe('GamePredictionsComponent', () => {
  let component: GamePredictionsComponent;
  let fixture: ComponentFixture<GamePredictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamePredictionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamePredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
