import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAnswerSelectorComponent } from './user-answer-selector.component';

describe('UserAnswerSelectorComponent', () => {
  let component: UserAnswerSelectorComponent;
  let fixture: ComponentFixture<UserAnswerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAnswerSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAnswerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
