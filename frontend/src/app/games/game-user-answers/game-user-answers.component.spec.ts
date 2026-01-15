import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameUserAnswersComponent } from './game-user-answers.component';

describe('GameUserAnswersComponent', () => {
  let component: GameUserAnswersComponent;
  let fixture: ComponentFixture<GameUserAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameUserAnswersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameUserAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
