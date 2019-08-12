import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlayerBanComponent } from './add-player-ban.component';

describe('AddPlayerBanComponent', () => {
  let component: AddPlayerBanComponent;
  let fixture: ComponentFixture<AddPlayerBanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlayerBanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlayerBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
