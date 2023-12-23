import { Component, EventEmitter } from '@angular/core';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { MinimumTf2InGameHoursDialogComponent } from './minimum-tf2-in-game-hours-dialog.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-wrapper',
  template: `<app-minimum-tf2-in-game-hours-dialog
    [minimumTf2InGameHours]="minimumTf2InGameHours"
    (accept)="accept.next($event)"
    (cancel)="cancel.next()"
  ></app-minimum-tf2-in-game-hours-dialog>`,
})
class TestWrapperComponent {
  minimumTf2InGameHours: number;
  accept = new EventEmitter<number>();
  cancel = new EventEmitter<void>();
}

describe(MinimumTf2InGameHoursDialogComponent.name, () => {
  let component: TestWrapperComponent;
  let fixture: MockedComponentFixture<TestWrapperComponent>;

  beforeEach(() =>
    MockBuilder(TestWrapperComponent).keep(
      MinimumTf2InGameHoursDialogComponent,
    ),
  );

  beforeEach(() => {
    fixture = MockRender(TestWrapperComponent);
    component = fixture.point.componentInstance;
    component.minimumTf2InGameHours = 500;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the value to the input', () => {
    const input = ngMocks.find('input[type=number]')
      .nativeElement as HTMLInputElement;
    expect(input.value).toEqual('500');
  });

  describe('when accepted', () => {
    let acceptButton: HTMLButtonElement;

    beforeEach(() => {
      acceptButton = ngMocks.find('button[okButton]').nativeElement;
    });

    it('should accept', done => {
      component.accept.subscribe(number => {
        expect(number).toEqual(500);
        done();
      });

      acceptButton.click();
    });
  });

  describe('when canceled', () => {
    let cancelButton: HTMLButtonElement;

    beforeEach(() => {
      cancelButton = ngMocks.find('button[cancelButton]').nativeElement;
    });

    it('should cancel', done => {
      component.cancel.subscribe(() => done());
      cancelButton.click();
      expect().nothing();
    });
  });
});
