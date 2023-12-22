import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';
import { ServemeTfConfiguration } from '../models/serveme-tf-configuration';
import { ConfigurationService } from '@app/configuration/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class ServemeTfConfigurationResolver {
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
