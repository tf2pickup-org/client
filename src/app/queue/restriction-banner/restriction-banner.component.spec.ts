import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { RestrictionBannerComponent } from './restriction-banner.component';

describe('RestrictionBannerComponent', () => {
  let component: RestrictionBannerComponent;
  let fixture: MockedComponentFixture<RestrictionBannerComponent>;

  beforeEach(() => MockBuilder(RestrictionBannerComponent));

  beforeEach(() => {
    fixture = MockRender(RestrictionBannerComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
