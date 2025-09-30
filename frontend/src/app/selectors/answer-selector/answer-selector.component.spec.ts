import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSelectorComponent } from './answer-selector.component';

describe('AnswerSelectorComponent', () => {
  let component: AnswerSelectorComponent;
  let fixture: ComponentFixture<AnswerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnswerSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
