import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePenaltiesComponent } from './game-penalties.component';

describe('GamePenaltiesComponent', () => {
  let component: GamePenaltiesComponent;
  let fixture: ComponentFixture<GamePenaltiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamePenaltiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamePenaltiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
