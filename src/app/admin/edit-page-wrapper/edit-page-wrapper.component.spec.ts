import { Component } from '@angular/core';
import { NavigateBackDirective } from '@app/shared/navigate-back.directive';
import { TablerIconComponent } from 'angular-tabler-icons';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { EditPageWrapperComponent } from './edit-page-wrapper.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-wrapper',
  template:
    '<app-edit-page-wrapper [title]="title" [saveDisabled]="saveDisabled"></app-edit-page-wrapper>',
})
class TestWrapperComponent {
  title: string;
  saveDisabled = false;
  submitButton = true;
}

describe(EditPageWrapperComponent.name, () => {
  let component: TestWrapperComponent;
  let fixture: MockedComponentFixture<EditPageWrapperComponent>;

  beforeEach(() =>
    MockBuilder(TestWrapperComponent)
      .keep(EditPageWrapperComponent)
      .mock(TablerIconComponent)
      .mock(NavigateBackDirective),
  );

  beforeEach(() => {
    fixture = MockRender(TestWrapperComponent);
    component = fixture.point.componentInstance;
    component.title = 'just testing';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const title = ngMocks.find('div.mdc-typography--headline5')
      .nativeElement as HTMLElement;
    expect(title.innerText).toEqual('just testing');
  });

  describe('go back button', () => {
    it('should have the appNavigateBack directive', () => {
      expect(
        ngMocks.find('button[goBackButton][appNavigateBack]'),
      ).toBeTruthy();
    });
  });

  describe('save button', () => {
    let saveButton: HTMLButtonElement;

    beforeEach(() => {
      saveButton = ngMocks.find('button[saveButton]').nativeElement;
    });

    it('should be rendered', () => {
      expect(saveButton).toBeTruthy();
      expect(saveButton.type).toEqual('submit');
    });

    describe('when disabled', () => {
      beforeEach(() => {
        component.saveDisabled = true;
        fixture.detectChanges();
      });

      it('should be disabled', () => {
        expect(saveButton.disabled).toBe(true);
      });
    });

    describe('when enabled', () => {
      beforeEach(() => {
        component.saveDisabled = false;
        fixture.detectChanges();
      });

      it('should be enabled', () => {
        expect(saveButton.disabled).toBe(false);
      });
    });
  });
});
