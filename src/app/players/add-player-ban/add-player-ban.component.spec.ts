import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlayerBanComponent } from './add-player-ban.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

const actions = new Subject<Action>();

describe('AddPlayerBanComponent', () => {
  let component: AddPlayerBanComponent;
  let fixture: ComponentFixture<AddPlayerBanComponent>;

  const initialState = {
    players: {
      players: {
        ids: [ 'FAKE_ID' ],
        entities: {
          FAKE_ID: {
            id: 'FAKE_ID',
            name: 'FAKE_NAME',
          },
        },
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlayerBanComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Actions, useValue: actions },
      ]
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
