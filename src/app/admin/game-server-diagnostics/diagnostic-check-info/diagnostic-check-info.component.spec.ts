import { TablerIconComponent } from 'angular-tabler-icons';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { DiagnosticCheckInfoComponent } from './diagnostic-check-info.component';

describe(DiagnosticCheckInfoComponent.name, () => {
  let component: DiagnosticCheckInfoComponent;
  let fixture: MockedComponentFixture<DiagnosticCheckInfoComponent>;

  beforeEach(() =>
    MockBuilder(DiagnosticCheckInfoComponent).mock(TablerIconComponent),
  );

  beforeEach(() => {
    fixture = MockRender(DiagnosticCheckInfoComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
