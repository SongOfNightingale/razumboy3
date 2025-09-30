import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaQuestionSelectorComponent } from './media-question-selector.component';

describe('MediaQuestionSelectorComponent', () => {
  let component: MediaQuestionSelectorComponent;
  let fixture: ComponentFixture<MediaQuestionSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaQuestionSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MediaQuestionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
