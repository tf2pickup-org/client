import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { scrambleMaps } from '@app/queue/queue.actions';
import { Store } from '@ngrx/store';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { ScrambleMapsComponent } from './scramble-maps.component';

describe(ScrambleMapsComponent.name, () => {
  let component: ScrambleMapsComponent;
  let fixture: MockedComponentFixture<ScrambleMapsComponent>;
  let store: jasmine.SpyObj<Store>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => MockBuilder(ScrambleMapsComponent)
    .mock(Store)
    .mock(Router)
  );

  beforeEach(() => {
    fixture = MockRender(ScrambleMapsComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scramble maps', () => {
    expect(store.dispatch).toHaveBeenCalledWith(scrambleMaps());
  });

  it('should route back to the main page', () => {
    expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
  });
});
