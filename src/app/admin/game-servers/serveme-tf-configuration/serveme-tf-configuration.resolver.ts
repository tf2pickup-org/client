import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ServemeTfConfiguration } from '../models/serveme-tf-configuration';
import { ConfigurationService } from '@app/configuration/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class ServemeTfConfigurationResolver
  implements Resolve<ServemeTfConfiguration>
{
  constructor(private readonly configurationService: ConfigurationService) {}

  resolve(): Observable<ServemeTfConfiguration> {
    return this.configurationService
      .fetchValues<[string]>('serveme_tf.preferred_region')
      .pipe(
        map(([preferredRegion]) => ({
          preferredRegion: preferredRegion.value,
        })),
      );
  }
}
