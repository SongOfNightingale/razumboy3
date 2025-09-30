import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarGameComponent } from './sidebar-game.component';

describe('SidebarGameComponent', () => {
  let component: SidebarGameComponent;
  let fixture: ComponentFixture<SidebarGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
