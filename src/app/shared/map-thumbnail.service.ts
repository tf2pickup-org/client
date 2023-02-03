import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '@environment';
import { catchError, map, Observable, of } from 'rxjs';

interface MapThumbnailUrlParams {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root',
})
export class MapThumbnailService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly sanitizer: DomSanitizer,
  ) {}

  // skipcq: JS-0105
  getMapThumbnailUrl(
    map: string,
    { width, height }: MapThumbnailUrlParams = { width: 300, height: 169 },
  ) {
    const mapName = map.match(/^([a-z]+_[a-zA-Z0-9]+)/)?.[0] ?? 'unknown';
    return `${environment.mapThumbnailServiceUrl}/unsafe/${width}x${height}/${mapName}.jpg`;
  }

  getMapThumbnail(
    _map: string,
    params: MapThumbnailUrlParams = { width: 300, height: 169 },
  ): Observable<SafeUrl> {
    const url = this.getMapThumbnailUrl(_map, params);
    return this.httpClient.get(url, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob)),
      map(objectUrl => this.sanitizer.bypassSecurityTrustUrl(objectUrl)),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of('/assets/unknown-map.png');
        } else {
          throw error;
        }
      }),
    );
  }
}
