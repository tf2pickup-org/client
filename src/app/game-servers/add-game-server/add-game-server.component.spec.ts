import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGameServerComponent } from './add-game-server.component';

describe('AddGameServerComponent', () => {
  let component: AddGameServerComponent;
  let fixture: ComponentFixture<AddGameServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGameServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGameServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
