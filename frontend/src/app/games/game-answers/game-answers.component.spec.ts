import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAnswersComponent } from './game-answers.component';

describe('GameAnswersComponent', () => {
  let component: GameAnswersComponent;
  let fixture: ComponentFixture<GameAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameAnswersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
