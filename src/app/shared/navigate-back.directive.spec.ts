import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { NavigateBackDirective } from './navigate-back.directive';

describe(NavigateBackDirective.name, () => {
  let fixture: MockedComponentFixture;
  let directive: NavigateBackDirective;

  beforeEach(() => MockBuilder(NavigateBackDirective).mock(Location));

  beforeEach(() => {
    fixture = MockRender(`<button appNavigateBack>`);
    directive = ngMocks.get(fixture.point, NavigateBackDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('when clicked', () => {
    beforeEach(() => {
      fixture.point.triggerEventHandler('click', null);
    });

    it('should go back', () => {
      const location = TestBed.get(Location);
      expect(location.back).toHaveBeenCalled();
    });
  });
});
