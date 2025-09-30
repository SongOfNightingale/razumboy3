import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBattlefieldComponent } from './create-battlefield.component';

describe('CreateBattlefieldComponent', () => {
  let component: CreateBattlefieldComponent;
  let fixture: ComponentFixture<CreateBattlefieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBattlefieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateBattlefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
