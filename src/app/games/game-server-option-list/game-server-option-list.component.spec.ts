import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { GameServerOptionListComponent } from './game-server-option-list.component';

describe('GameServerOptionListComponent', () => {
  let component: GameServerOptionListComponent;
  let fixture: MockedComponentFixture<GameServerOptionListComponent>;

  beforeEach(() => MockBuilder(GameServerOptionListComponent));

  beforeEach(() => {
    fixture = MockRender(GameServerOptionListComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
