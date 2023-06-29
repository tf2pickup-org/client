import { ConfigurationEditComponent } from './configuration-edit.component';
import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { Subject, take } from 'rxjs';
import { ConfigurationEntry } from '@app/configuration/models/configuration-entry';
import { NgxEditInlineComponent } from 'ngx-edit-inline';

describe('ConfigurationEditComponent', () => {
  let component: ConfigurationEditComponent;
  let fixture: MockedComponentFixture<ConfigurationEditComponent>;
  let configuration: Subject<ConfigurationEntry[]>;

  beforeEach(() => {
    configuration = new Subject();
  });

  beforeEach(() =>
    MockBuilder(ConfigurationEditComponent)
      .mock(ConfigurationService, {
        fetchValues: jasmine
          .createSpy('fetchValues')
          .and.callFake(() => configuration.pipe(take(1))),
      })
      .mock(NgxEditInlineComponent),
  );

  beforeEach(() => {
    fixture = MockRender(ConfigurationEditComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when configuration is fetched', () => {
    let editComponent: NgxEditInlineComponent;

    beforeEach(() => {
      configuration.next([
        {
          key: 'games.whitelist_id',
          schema: { type: 'string' },
          value: 'etf2l_6v6',
        },
      ]);

      fixture.detectChanges();
      editComponent = ngMocks.findInstance(NgxEditInlineComponent);
    });

    it('should render input', () => {
      const edits = ngMocks.findInstances(NgxEditInlineComponent);
      expect(edits.length).toBe(1);

      expect(editComponent.value).toEqual('"etf2l_6v6"');
    });
  });
});
