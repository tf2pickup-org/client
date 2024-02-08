import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { getMapThumbnailUrls } from './get-map-thumbnail-urls';

@Component({
  selector: 'app-map-thumbnail',
  templateUrl: './map-thumbnail.component.html',
  styleUrls: ['./map-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class MapThumbnailComponent implements OnChanges {
  private possibleSrcs: string[];
  src?: string;
  loaded = false;

  @Input({ required: true })
  map!: string;

  @Input()
  width = 300;

  @Input()
  height = 160;

  ngOnChanges() {
    this.possibleSrcs = getMapThumbnailUrls(this.map, {
      width: this.width,
      height: this.height,
    });
    this.tryNextSrc();
  }

  handleError() {
    this.tryNextSrc();
  }

  private tryNextSrc() {
    if (this.possibleSrcs.length === 0) {
      this.src = '/assets/unknown-map.png';
    } else {
      this.src = this.possibleSrcs.shift();
    }
  }
}
