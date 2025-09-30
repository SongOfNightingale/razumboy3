import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDrawAnswersComponent } from './game-draw-answers.component';

describe('GameDrawAnswersComponent', () => {
  let component: GameDrawAnswersComponent;
  let fixture: ComponentFixture<GameDrawAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameDrawAnswersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameDrawAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
