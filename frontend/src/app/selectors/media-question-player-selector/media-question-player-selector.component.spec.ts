import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaQuestionPlayerSelectorComponent } from './media-question-player-selector.component';

describe('MediaQuestionPlayerSelectorComponent', () => {
  let component: MediaQuestionPlayerSelectorComponent;
  let fixture: ComponentFixture<MediaQuestionPlayerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaQuestionPlayerSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MediaQuestionPlayerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
