import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlefieldSelectorComponent } from './battlefield-selector.component';

describe('BattlefieldSelectorComponent', () => {
  let component: BattlefieldSelectorComponent;
  let fixture: ComponentFixture<BattlefieldSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BattlefieldSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BattlefieldSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
