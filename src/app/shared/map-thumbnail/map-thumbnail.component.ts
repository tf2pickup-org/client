import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { MapThumbnailService } from '../map-thumbnail.service';

@Component({
  selector: 'app-map-thumbnail',
  templateUrl: './map-thumbnail.component.html',
  styleUrls: ['./map-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapThumbnailComponent implements OnChanges {
  src?: string;
  loaded = false;

  @Input({ required: true })
  map!: string;

  @Input()
  width = 300;

  @Input()
  height = 160;

  constructor(private readonly mapThumbnailService: MapThumbnailService) {}

  ngOnChanges() {
    this.src = this.mapThumbnailService.getMapThumbnailUrl(this.map, {
      width: this.width,
      height: this.height,
    });
  }

  handleError() {
    this.src = '/assets/unknown-map.png';
  }
}
