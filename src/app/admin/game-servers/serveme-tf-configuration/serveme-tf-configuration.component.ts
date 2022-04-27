import { Location } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { ServemeTfService } from '../serveme-tf.service';

@Component({
  selector: 'app-serveme-tf-configuration',
  templateUrl: './serveme-tf-configuration.component.html',
  styleUrls: ['./serveme-tf-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServemeTfConfigurationComponent implements OnInit {
  form = this.formBuilder.group({
    preferredRegion: [''],
  });
  availableRegions: Observable<string[]> = this.servemeTfService
    .fetchAllServers()
    .pipe(
      map(servers => servers.map(server => server.flag)),
      map(flags => [...new Set(flags)]),
    );

  constructor(
    private formBuilder: FormBuilder,
    private servemeTfService: ServemeTfService,
    private changeDetector: ChangeDetectorRef,
    private location: Location,
  ) {}

  ngOnInit() {
    this.servemeTfService.fetchConfiguration().subscribe(configuration => {
      this.form.patchValue({
        preferredRegion: configuration.preferredRegion,
      });
      this.changeDetector.markForCheck();
    });
  }

  save() {
    this.servemeTfService
      .storeConfiguration({
        preferredRegion: this.preferredRegion,
      })
      .subscribe(() => this.location.back());
  }

  get preferredRegion(): string {
    return this.form.get('preferredRegion').value;
  }
}
