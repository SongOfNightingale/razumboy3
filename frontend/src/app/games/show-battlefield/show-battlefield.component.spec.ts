import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBattlefieldComponent } from './show-battlefield.component';

describe('ShowBattlefieldComponent', () => {
  let component: ShowBattlefieldComponent;
  let fixture: ComponentFixture<ShowBattlefieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowBattlefieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowBattlefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
