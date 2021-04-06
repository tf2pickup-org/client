import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ioConnected } from '@app/io/io.selectors';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { OfflineStateBannerComponent } from './offline-state-banner.component';

describe(OfflineStateBannerComponent.name, () => {
  let component: OfflineStateBannerComponent;
  let fixture: MockedComponentFixture;
  let store: MockStore;

  beforeEach(() =>
    MockBuilder(OfflineStateBannerComponent).provide(
      provideMockStore({
        selectors: [{ selector: ioConnected, value: undefined }],
      }),
    ),
  );

  beforeEach(() => {
    fixture = MockRender(OfflineStateBannerComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when ioConnected === undefined', () => {
    it('should not render the banner', () => {
      expect(() => ngMocks.find('.offline-state-banner')).toThrow();
    });
  });

  describe('when ioConnected === false', () => {
    beforeEach(fakeAsync(() => {
      ioConnected.setResult(false);
      store.refreshState();
      tick(1100);
      fixture.detectChanges();
    }));

    it('should render the banner', () => {
      expect(ngMocks.find('.offline-state-banner')).toBeTruthy();
    });
  });

  describe('when ioConnected === true', () => {
    beforeEach(() => {
      ioConnected.setResult(true);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should not render the banner', () => {
      expect(() => ngMocks.find('.offline-state-banner')).toThrow();
    });
  });
});
