import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { GuildInfo } from './models/guild-info';

@Injectable({
  providedIn: 'root',
})
export class DiscordService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  fetchGuilds(): Observable<GuildInfo[]> {
    return this.http.get<GuildInfo[]>(`${this.apiUrl}/discord/guilds`);
  }
}
