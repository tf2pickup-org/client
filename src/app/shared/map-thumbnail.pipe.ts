import { Pipe, PipeTransform } from '@angular/core';
import { MapThumbnailService } from './map-thumbnail.service';

@Pipe({
  name: 'mapThumbnail',
})
export class MapThumbnailPipe implements PipeTransform {
  constructor(private mapThumbnailService: MapThumbnailService) {}

  transform(value: string): string {
    return this.mapThumbnailService.getMapThumbnailPath(value);
  }
}
