import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDrawComponent } from './choose-draw.component';

describe('ChooseDrawComponent', () => {
  let component: ChooseDrawComponent;
  let fixture: ComponentFixture<ChooseDrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseDrawComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
