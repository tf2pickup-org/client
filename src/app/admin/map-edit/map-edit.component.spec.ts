import { FeatherComponent } from 'angular-feather';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { MapEditComponent } from './map-edit.component';

describe(MapEditComponent.name, () => {
  let component: MapEditComponent;
  let fixture: MockedComponentFixture<MapEditComponent>;

  beforeEach(() => MockBuilder(MapEditComponent).mock(FeatherComponent));

  beforeEach(() => {
    fixture = MockRender(MapEditComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
