import { ActivatedRoute } from '@angular/router';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject } from 'rxjs';
import { RulesComponent } from './rules.component';
import { MarkdownComponent } from 'ngx-markdown';

describe(RulesComponent.name, () => {
  let component: RulesComponent;
  let fixture: MockedComponentFixture<RulesComponent>;
  let routeData: Subject<unknown>;

  beforeEach(() => (routeData = new Subject()));

  beforeEach(() =>
    MockBuilder(RulesComponent)
      .mock(ActivatedRoute, {
        data: routeData.asObservable(),
      })
      .mock(MarkdownComponent),
  );

  beforeEach(() => {
    fixture = MockRender(RulesComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the document is loaded', () => {
    beforeEach(() => {
      routeData.next({ document: { body: 'rules body' } });
      fixture.detectChanges();
    });

    it('should render the document', () => {
      const markdown = ngMocks.find(MarkdownComponent).componentInstance;
      expect(markdown.data).toEqual('rules body');
    });
  });
});
