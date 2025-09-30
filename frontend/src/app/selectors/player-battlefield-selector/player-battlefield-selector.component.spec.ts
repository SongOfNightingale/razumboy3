import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBattlefieldSelectorComponent } from './player-battlefield-selector.component';

describe('PlayerBattlefieldSelectorComponent', () => {
  let component: PlayerBattlefieldSelectorComponent;
  let fixture: ComponentFixture<PlayerBattlefieldSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerBattlefieldSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerBattlefieldSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
