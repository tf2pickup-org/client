import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { race, zip } from 'rxjs';
import { MDCSwitch } from '@material/switch';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { MinimumTf2InGameHoursDialogComponent } from './minimum-tf2-in-game-hours-dialog/minimum-tf2-in-game-hours-dialog.component';
import { Location } from '@angular/common';
import { Etf2lAccountRequired } from '@app/configuration/models/etf2l-account-required';
import { MinimumTf2InGameHours } from '@app/configuration/models/minimum-tf2-in-game-hours';
import { map } from 'rxjs/operators';
import { DenyPlayersWithNoSkillAssigned } from '@app/configuration/models/deny-players-with-no-skill-assigned';

@Component({
  selector: 'app-player-restrictions',
  templateUrl: './player-restrictions.component.html',
  styleUrls: ['./player-restrictions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerRestrictionsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  form = this.formBuilder.group({
    etf2lAccountRequired: [false],
    minimumTf2InGameHours: [0],
    denyPlayersWithNoSkillAssigned: [false],
  });

  @ViewChild('etf2lAccountRequiredSwitch')
  etf2lAccountRequiredControl: ElementRef;

  @ViewChild('denyPlayersWithNoSkillAssignedSwitch')
  denyPlayersWithNoSkillAssignedControl: ElementRef;

  private etf2lAccountRequiredSwitch: MDCSwitch;
  private denyPlayersWithNoSkillAssignedSwitch: MDCSwitch;

  constructor(
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService,
    private changeDetector: ChangeDetectorRef,
    private overlay: Overlay,
    private location: Location,
  ) {}

  ngOnInit() {
    zip(
      this.configurationService
        .fetchValue<Etf2lAccountRequired>(
          ConfigurationEntryKey.etf2lAccountRequired,
        )
        .pipe(map(entry => entry.value)),
      this.configurationService
        .fetchValue<MinimumTf2InGameHours>(
          ConfigurationEntryKey.minimumTf2InGameHours,
        )
        .pipe(map(entry => entry.value)),
      this.configurationService
        .fetchValue<DenyPlayersWithNoSkillAssigned>(
          ConfigurationEntryKey.denyPlayersWithNoSkillAssigned,
        )
        .pipe(map(entry => entry.value)),
    ).subscribe(
      ([
        etf2lAccountRequired,
        minimumTf2InGameHours,
        denyPlayersWithNoSkillAssigned,
      ]) => {
        this.form.patchValue({
          etf2lAccountRequired,
          minimumTf2InGameHours,
          denyPlayersWithNoSkillAssigned,
        });
        this.etf2lAccountRequiredSwitch.selected = etf2lAccountRequired;
        this.changeDetector.markForCheck();
      },
    );
  }

  ngAfterViewInit() {
    this.etf2lAccountRequiredSwitch = new MDCSwitch(
      this.etf2lAccountRequiredControl.nativeElement,
    );
    this.denyPlayersWithNoSkillAssignedSwitch = new MDCSwitch(
      this.denyPlayersWithNoSkillAssignedControl.nativeElement,
    );
  }

  ngOnDestroy() {
    this.etf2lAccountRequiredSwitch.destroy();
    this.denyPlayersWithNoSkillAssignedSwitch.destroy();
  }

  save() {
    zip(
      this.configurationService.storeValue<Etf2lAccountRequired>({
        key: ConfigurationEntryKey.etf2lAccountRequired,
        value: this.etf2lAccountRequired,
      }),
      this.configurationService.storeValue<MinimumTf2InGameHours>({
        key: ConfigurationEntryKey.minimumTf2InGameHours,
        value: this.minimumTf2InGameHours,
      }),
      this.configurationService.storeValue<DenyPlayersWithNoSkillAssigned>({
        key: ConfigurationEntryKey.denyPlayersWithNoSkillAssigned,
        value: this.denyPlayersWithNoSkillAssigned,
      }),
    ).subscribe(() => this.location.back());
  }

  updateEtf2lAccountRequired() {
    this.form.patchValue({
      etf2lAccountRequired: !this.etf2lAccountRequired,
    });
    this.form.markAsDirty();
    this.changeDetector.markForCheck();
  }

  updateDenyPlayersWithNoSkillAssigned() {
    this.form.patchValue({
      denyPlayersWithNoSkillAssigned: !this.denyPlayersWithNoSkillAssigned,
    });
    this.form.markAsDirty();
    this.changeDetector.markForCheck();
  }

  openMinimumTf2InGameHoursDialog() {
    const overlay = this.overlay.create();
    const portal = new ComponentPortal(MinimumTf2InGameHoursDialogComponent);
    const component = overlay.attach(portal);

    component.instance.minimumTf2InGameHours = this.minimumTf2InGameHours;
    component.instance.accept.subscribe(minimumTf2InGameHours => {
      this.form.patchValue({ minimumTf2InGameHours });
      this.form.markAsDirty();
      this.changeDetector.markForCheck();
    });

    race(component.instance.accept, component.instance.cancel).subscribe(() => {
      overlay.dispose();
    });
  }

  get etf2lAccountRequired(): boolean {
    return this.form.get('etf2lAccountRequired').value;
  }

  get minimumTf2InGameHours(): number {
    return this.form.get('minimumTf2InGameHours').value;
  }

  get denyPlayersWithNoSkillAssigned(): boolean {
    return this.form.get('denyPlayersWithNoSkillAssigned').value;
  }
}
