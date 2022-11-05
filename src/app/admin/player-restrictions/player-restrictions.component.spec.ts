import { Overlay } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { DenyPlayersWithNoSkillAssigned } from '@app/configuration/models/deny-players-with-no-skill-assigned';
import { Etf2lAccountRequired } from '@app/configuration/models/etf2l-account-required';
import { MinimumTf2InGameHours } from '@app/configuration/models/minimum-tf2-in-game-hours';
import { FeatherComponent } from 'angular-feather';
import {
  MockBuilder,
  MockComponent,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { EditPageWrapperComponent } from '../edit-page-wrapper/edit-page-wrapper.component';
import { MinimumTf2InGameHoursDialogComponent } from './minimum-tf2-in-game-hours-dialog/minimum-tf2-in-game-hours-dialog.component';
import { PlayerRestrictionsComponent } from './player-restrictions.component';

describe(PlayerRestrictionsComponent.name, () => {
  let component: PlayerRestrictionsComponent;
  let fixture: MockedComponentFixture<PlayerRestrictionsComponent>;
  let etf2lAccountRequired: Subject<Etf2lAccountRequired>;
  let minimumTf2InGameHours: Subject<MinimumTf2InGameHours>;
  let denyPlayersWithNoSkillAssigned: Subject<DenyPlayersWithNoSkillAssigned>;
  let overlay: jasmine.SpyObj<Overlay>;
  let configurationService: jasmine.SpyObj<ConfigurationService>;
  let routeData: Subject<any>;

  beforeEach(() => {
    etf2lAccountRequired = new Subject();
    minimumTf2InGameHours = new Subject();
    denyPlayersWithNoSkillAssigned = new Subject();
    routeData = new Subject();
  });

  beforeEach(() =>
    MockBuilder(PlayerRestrictionsComponent)
      .keep(ReactiveFormsModule)
      .mock(ConfigurationService, {
        fetchValue: jasmine.createSpy('fetchValue').and.callFake(
          key =>
            ({
              [ConfigurationEntryKey.etf2lAccountRequired]:
                etf2lAccountRequired.pipe(take(1)),
              [ConfigurationEntryKey.minimumTf2InGameHours]:
                minimumTf2InGameHours.pipe(take(1)),
              [ConfigurationEntryKey.denyPlayersWithNoSkillAssigned]:
                denyPlayersWithNoSkillAssigned.pipe(take(1)),
            }[key]),
        ),
        storeValue: jasmine.createSpy('storeValue').and.callFake(
          entry =>
            ({
              [ConfigurationEntryKey.etf2lAccountRequired]:
                etf2lAccountRequired.pipe(take(1)),
              [ConfigurationEntryKey.minimumTf2InGameHours]:
                minimumTf2InGameHours.pipe(take(1)),
              [ConfigurationEntryKey.denyPlayersWithNoSkillAssigned]:
                denyPlayersWithNoSkillAssigned.pipe(take(1)),
            }[entry.key]),
        ),
      })
      .mock(Overlay)
      .keep(ChangeDetectorRef)
      .keep(EditPageWrapperComponent)
      .mock(FeatherComponent)
      .mock(Location)
      .mock(ActivatedRoute, {
        data: routeData.asObservable(),
      }),
  );

  beforeEach(() => {
    fixture = MockRender(PlayerRestrictionsComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    overlay = TestBed.inject(Overlay) as jasmine.SpyObj<Overlay>;
    configurationService = TestBed.inject(
      ConfigurationService,
    ) as jasmine.SpyObj<ConfigurationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when configuration is fetched', () => {
    beforeEach(() => {
      routeData.next({
        playerRestrictions: {
          etf2lAccountRequired: true,
          minimumTf2InGameHours: 500,
          denyPlayersWithNoSkillAssigned: false,
        },
      });
      fixture.detectChanges();
      fixture.componentInstance.ngAfterViewInit();
    });

    it('should set values on inputs', () => {
      const etf2lAccountRequiredCheckbox = ngMocks.find(
        '#etf2l-account-required-switch',
      ).nativeElement as HTMLButtonElement;
      expect(etf2lAccountRequiredCheckbox.getAttribute('aria-checked')).toBe(
        'true',
      );

      const minimumTf2InGameHoursField = ngMocks.find(
        '#minimum-tf2-in-game-hours-field',
      ).nativeElement as HTMLInputElement;
      expect(minimumTf2InGameHoursField.value).toEqual('500');

      const denyPlayersWithNoSkillAssigned = ngMocks.find(
        '#deny-players-with-no-skill-assigned-switch',
      ).nativeElement as HTMLButtonElement;
      expect(denyPlayersWithNoSkillAssigned.getAttribute('aria-checked')).toBe(
        'false',
      );
    });

    describe('when the minimum tf2 in-game hours item is clicked', () => {
      let dialog: MinimumTf2InGameHoursDialogComponent;

      beforeEach(() => {
        dialog = new (MockComponent(MinimumTf2InGameHoursDialogComponent))();
        overlay.create.and.returnValue({
          attach: () => ({ instance: dialog }),
          dispose: () => null,
        } as any);

        const item = ngMocks.find('li[minimumTf2InGameHoursItem]')
          .nativeElement as HTMLElement;
        item.click();
      });

      it('should attempt to open a dialog', () => {
        expect(overlay.create).toHaveBeenCalledTimes(1);
      });

      describe('when the new value is provided', () => {
        beforeEach(() => {
          dialog.accept.next(600);
          fixture.detectChanges();
        });

        it('should update the value in the form', () => {
          const minimumTf2InGameHoursField = ngMocks.find(
            '#minimum-tf2-in-game-hours-field',
          ).nativeElement as HTMLInputElement;
          expect(minimumTf2InGameHoursField.value).toEqual('600');
        });

        describe('and when the form is saved', () => {
          beforeEach(() => {
            const saveButton = ngMocks.find('button[type=submit]')
              .nativeElement as HTMLButtonElement;
            saveButton.click();
          });

          it('should update the value', () => {
            expect(configurationService.storeValue).toHaveBeenCalledWith({
              key: ConfigurationEntryKey.minimumTf2InGameHours,
              value: 600,
            } as MinimumTf2InGameHours);
          });

          describe('and when the values are updated', () => {
            beforeEach(() => {
              etf2lAccountRequired.next({
                key: ConfigurationEntryKey.etf2lAccountRequired,
                value: true,
              });
              minimumTf2InGameHours.next({
                key: ConfigurationEntryKey.minimumTf2InGameHours,
                value: 600,
              });
              denyPlayersWithNoSkillAssigned.next({
                key: ConfigurationEntryKey.denyPlayersWithNoSkillAssigned,
                value: true,
              });
            });

            it('should navigate back', () => {
              const location = TestBed.inject(
                Location,
              ) as jasmine.SpyObj<Location>;
              expect(location.back).toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
