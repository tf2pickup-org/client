import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MapThumbnailService } from '../../shared/map-thumbnail.service';

@Component({
  selector: 'app-map-vote-button',
  templateUrl: './map-vote-button.component.html',
  styleUrls: ['./map-vote-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapVoteButtonComponent {

  @Input()
  map: string;

  @Input()
  votePercent: number;

  @Input()
  selected = false;

  @Input()
  disabled = true;

  @Output()
  voteToggle = new EventEmitter<boolean>();

  get mapThumbnailImage() {
    return this.mapThumbnailService.getMapThumbnailPath(this.map);
  }

  constructor(
    private mapThumbnailService: MapThumbnailService,
  ) { }

  toggleVote() {
    this.voteToggle.emit(!this.selected);
  }

}
