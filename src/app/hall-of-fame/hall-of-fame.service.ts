import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { HallOfFame } from './models/hall-of-fame';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HallOfFameService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  fetchHallOfFames(): Observable<HallOfFame> {
    return this.http.get<HallOfFame>(`${this.apiUrl}/hall-of-fame`);
  }
}
