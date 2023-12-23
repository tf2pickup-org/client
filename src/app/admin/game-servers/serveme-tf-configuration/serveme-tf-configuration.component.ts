import { Location } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ServemeTfService } from '../serveme-tf.service';
import { ActivatedRoute, Data } from '@angular/router';
import { ServemeTfConfiguration } from '../models/serveme-tf-configuration';
import { ConfigurationService } from '@app/configuration/configuration.service';

@Component({
  selector: 'app-serveme-tf-configuration',
  templateUrl: './serveme-tf-configuration.component.html',
  styleUrls: ['./serveme-tf-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServemeTfConfigurationComponent implements OnInit, OnDestroy {
  form = this.formBuilder.group({
    preferredRegion: [''],
  });
  availableRegions: Observable<string[]> = this.servemeTfService
    .fetchAllServers()
    .pipe(
      map(servers => servers.map(server => server.flag)),
      map(flags => [...new Set(flags)]),
    );

  private readonly destroyed = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly servemeTfService: ServemeTfService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly configurationService: ConfigurationService,
  ) {}

  ngOnInit() {
    this.route.data
      .pipe(
        map<Data, ServemeTfConfiguration>(data => data['configuration']),
        takeUntil(this.destroyed),
      )
      .subscribe(({ preferredRegion }) => {
        this.form.patchValue({
          preferredRegion,
        });
        this.changeDetector.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    this.configurationService
      .storeValues({
        key: 'serveme_tf.preferred_region',
        value: this.preferredRegion,
      })
      .subscribe(() => this.location.back());
  }

  get preferredRegion(): string {
    return this.form.get('preferredRegion').value;
  }
}
