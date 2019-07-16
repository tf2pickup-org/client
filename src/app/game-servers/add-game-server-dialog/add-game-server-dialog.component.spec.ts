import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGameServerDialogComponent } from './add-game-server-dialog.component';

describe('AddGameServerDialogComponent', () => {
  let component: AddGameServerDialogComponent;
  let fixture: ComponentFixture<AddGameServerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGameServerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGameServerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
