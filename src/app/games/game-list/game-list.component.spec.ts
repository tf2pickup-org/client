import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameListComponent } from './game-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '../games.service';
import { NEVER, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class GamesServiceStub {
  fetchGames() { return NEVER; }
}

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameListComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: GamesService, useClass: GamesServiceStub },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#pageChanged()', () => {
    it('should load a given page', () => {
      const spy = spyOn(TestBed.get(GamesService), 'fetchGames').and.returnValue(of({ itemCount: 50, results: [] }));
      component.pageChanged({ page: 1 });
      expect(spy).toHaveBeenCalledWith(0, 10);

      component.pageChanged({ page: 5 });
      expect(spy).toHaveBeenCalledWith(40, 10);
    });
  });

});
