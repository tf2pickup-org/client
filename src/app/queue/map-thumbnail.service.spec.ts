import { TestBed } from '@angular/core/testing';

import { MapThumbnailService } from './map-thumbnail.service';

describe('MapThumbnailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapThumbnailService = TestBed.get(MapThumbnailService);
    expect(service).toBeTruthy();
  });
});
