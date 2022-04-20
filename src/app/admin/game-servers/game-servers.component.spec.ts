import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { GameServersComponent } from './game-servers.component';

describe(GameServersComponent.name, () => {
  let component: GameServersComponent;
  let fixture: MockedComponentFixture<GameServersComponent>;

  beforeEach(() => MockBuilder(GameServersComponent));

  beforeEach(() => {
    fixture = MockRender(GameServersComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
