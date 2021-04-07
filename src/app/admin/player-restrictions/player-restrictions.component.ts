import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { race, zip } from 'rxjs';
import { MDCSwitch } from '@material/switch';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { MinimumTf2InGameHoursDialogComponent } from './minimum-tf2-in-game-hours-dialog/minimum-tf2-in-game-hours-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-player-restrictions',
  templateUrl: './player-restrictions.component.html',
  styleUrls: ['./player-restrictions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerRestrictionsComponent implements OnInit, AfterViewInit, OnDestroy {

  form = this.formBuilder.group({
    etf2lAccountRequired: [true],
    minimumTf2InGameHours: [0],
  });

  @ViewChild('etf2lAccountRequiredSwitch')
  etf2lAccountRequiredControl: ElementRef;

  private etf2lAccountRequiredSwitch: MDCSwitch;

  constructor(
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService,
    private changeDetector: ChangeDetectorRef,
    private overlay: Overlay,
    private location: Location,
  ) { }

  ngOnInit() {
    zip(
      this.configurationService.fetchValue<boolean>(ConfigurationEntryKey.etf2lAccountRequired),
      this.configurationService.fetchValue<number>(ConfigurationEntryKey.minimumTf2InGameHours),
    ).subscribe(([ etf2lAccountRequired, minimumTf2InGameHours ]) => {
      this.form.patchValue({ etf2lAccountRequired, minimumTf2InGameHours });
      this.changeDetector.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.etf2lAccountRequiredSwitch = new MDCSwitch(this.etf2lAccountRequiredControl.nativeElement);
  }

  ngOnDestroy() {
    this.etf2lAccountRequiredSwitch.destroy();
  }

  save() {
    zip(
      this.configurationService.storeValue<boolean>(ConfigurationEntryKey.etf2lAccountRequired, this.etf2lAccountRequired),
      this.configurationService.storeValue<number>(ConfigurationEntryKey.minimumTf2InGameHours, this.minimumTf2InGameHours),
    ).subscribe(() => this.location.back());
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

}
