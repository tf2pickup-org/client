import { TablerIconComponent } from 'angular-tabler-icons';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { MapEditComponent } from './map-edit.component';

describe(MapEditComponent.name, () => {
  let component: MapEditComponent;
  let fixture: MockedComponentFixture<MapEditComponent>;

  beforeEach(() => MockBuilder(MapEditComponent).mock(TablerIconComponent));

  beforeEach(() => {
    fixture = MockRender(MapEditComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
