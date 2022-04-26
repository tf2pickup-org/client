import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { Subject } from 'rxjs';
import { GameServersComponent } from './game-servers.component';
import { ServemeTfService } from './serveme-tf.service';

describe(GameServersComponent.name, () => {
  let component: GameServersComponent;
  let fixture: MockedComponentFixture<GameServersComponent>;
  let servemeTfEnabled: Subject<boolean>;

  beforeEach(() => {
    servemeTfEnabled = new Subject();
  });

  beforeEach(() =>
    MockBuilder(GameServersComponent).mock(ServemeTfService, {
      isEnabled: servemeTfEnabled.asObservable(),
    }),
  );

  beforeEach(() => {
    fixture = MockRender(GameServersComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
