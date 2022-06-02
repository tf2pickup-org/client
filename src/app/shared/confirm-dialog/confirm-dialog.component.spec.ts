import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: MockedComponentFixture<ConfirmDialogComponent>;

  beforeEach(() => MockBuilder(ConfirmDialogComponent));

  beforeEach(() => {
    fixture = MockRender(ConfirmDialogComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when accepted', () => {
    let acceptEmitted = false;

    beforeEach(() => {
      component.accept.subscribe(() => (acceptEmitted = true));
      const acceptButton = ngMocks.find('button[acceptButton]')
        .nativeElement as HTMLButtonElement;
      acceptButton.click();
    });

    it('should emit accept event', () => {
      expect(acceptEmitted).toBe(true);
    });
  });

  describe('when canceled', () => {
    let cancelEmitted = false;

    beforeEach(() => {
      component.cancel.subscribe(() => (cancelEmitted = true));
      const cancelButton = ngMocks.find('button[cancelButton]')
        .nativeElement as HTMLButtonElement;
      cancelButton.click();
    });

    it('should emit accept event', () => {
      expect(cancelEmitted).toBe(true);
    });
  });
});
