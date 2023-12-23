import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';
import {
  MockBuilder,
  MockComponent,
  MockedComponentFixture,
  MockRender,
} from 'ng-mocks';
import { GameAdminButtonsComponent } from './game-admin-buttons.component';

describe(GameAdminButtonsComponent.name, () => {
  let component: GameAdminButtonsComponent;
  let fixture: MockedComponentFixture<GameAdminButtonsComponent>;
  let overlay: jasmine.SpyObj<Overlay>;
  let dialog: ConfirmDialogComponent;

  beforeEach(() => MockBuilder(GameAdminButtonsComponent).mock(Overlay));

  beforeEach(() => {
    fixture = MockRender(GameAdminButtonsComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    overlay = TestBed.inject(Overlay) as jasmine.SpyObj<Overlay>;
  });

  beforeEach(() => {
    dialog = new (MockComponent(ConfirmDialogComponent))();
    overlay.create.and.returnValue({
      attach: () => ({ instance: dialog }),
      dispose: () => null,
    } as unknown as OverlayRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the reinitialize server button', () => {
    const reinitializeBtn = fixture.debugElement.query(
      By.css('.reinitialize-server-button'),
    ).nativeElement as HTMLButtonElement;
    expect(reinitializeBtn).toBeTruthy();
  });

  describe('when reinitialize button clicked', () => {
    beforeEach(() => {
      const reinitializeBtn = fixture.debugElement.query(
        By.css('.reinitialize-server-button'),
      ).nativeElement as HTMLButtonElement;
      reinitializeBtn.click();
    });

    it('should open the confirm dialog', () => {
      expect(overlay.create).toHaveBeenCalledTimes(1);
    });

    describe('when the user confirms', () => {
      let reinitialized = false;

      beforeEach(() => {
        component.reinitializeServer.subscribe(() => (reinitialized = true));

        dialog.accept.next();
        fixture.detectChanges();
      });

      it('should reinitialize', () => {
        expect(reinitialized).toBe(true);
      });
    });
  });

  it('should render the force end button', () => {
    const forceEndBtn = fixture.debugElement.query(By.css('.force-end-button'))
      .nativeElement as HTMLButtonElement;
    expect(forceEndBtn).toBeTruthy();
  });

  describe('when force end button', () => {
    beforeEach(() => {
      const forceEndBtn = fixture.debugElement.query(
        By.css('.force-end-button'),
      ).nativeElement as HTMLButtonElement;
      forceEndBtn.click();
    });

    it('should open the confirm dialog', () => {
      expect(overlay.create).toHaveBeenCalledTimes(1);
    });

    describe('when the user confirms', () => {
      let forceEnded = false;

      beforeEach(() => {
        component.forceEnd.subscribe(() => (forceEnded = true));

        dialog.accept.next();
        fixture.detectChanges();
      });

      it('should force end', () => {
        expect(forceEnded).toBe(true);
      });
    });
  });
});
