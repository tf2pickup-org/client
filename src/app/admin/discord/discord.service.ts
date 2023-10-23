import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { Guild } from './models/guild';
import { TextChannel } from './models/text-channel';
import { Role } from './models/role';

@Injectable({
  providedIn: 'root',
})
export class DiscordService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {}

  fetchGuilds(): Observable<Guild[]> {
    return this.http.get<Guild[]>(`${this.apiUrl}/discord/guilds`);
  }

  fetchTextChannels(guildId: string): Observable<TextChannel[]> {
    return this.http.get<TextChannel[]>(
      `${this.apiUrl}/discord/guilds/${guildId}/text-channels`,
    );
  }

  fetchRoles(guildId: string): Observable<Role[]> {
    return this.http.get<Role[]>(
      `${this.apiUrl}/discord/guilds/${guildId}/roles`,
    );
  }
}
