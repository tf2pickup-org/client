import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { Subject } from 'rxjs';
import { StatisticsService } from '../statistics.service';
import { StatisticsComponent } from './statistics.component';

describe(StatisticsComponent.name, () => {
  let component: StatisticsComponent;
  let fixture: MockedComponentFixture<StatisticsComponent>;

  beforeEach(() =>
    MockBuilder(StatisticsComponent).mock(StatisticsService, {
      fetchPlayedMapsCount: jasmine
        .createSpy('fetchPlayedMapsCount')
        .and.returnValue(new Subject()),
      fetchGameLaunchTimeSpans: jasmine
        .createSpy('fetchGameLaunchTimeSpans')
        .and.returnValue(new Subject()),
      fetchGameLaunchesPerDay: jasmine
        .createSpy('fetchGameLaunchesPerDay')
        .and.returnValue(new Subject()),
    }),
  );

  beforeEach(() => {
    fixture = MockRender(StatisticsComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
