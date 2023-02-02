import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { MapThumbnailService } from './map-thumbnail.service';

@Pipe({
  name: 'mapThumbnail',
})
export class MapThumbnailPipe implements PipeTransform {
  constructor(private mapThumbnailService: MapThumbnailService) {}

  transform(value: string, width = 300, height = 169): Observable<SafeUrl> {
    return this.mapThumbnailService.getMapThumbnail(value, {
      width,
      height,
    });
  }
}
