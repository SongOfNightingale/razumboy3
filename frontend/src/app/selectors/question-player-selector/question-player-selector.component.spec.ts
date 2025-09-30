import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPlayerSelectorComponent } from './question-player-selector.component';

describe('QuestionPlayerSelectorComponent', () => {
  let component: QuestionPlayerSelectorComponent;
  let fixture: ComponentFixture<QuestionPlayerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionPlayerSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionPlayerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
