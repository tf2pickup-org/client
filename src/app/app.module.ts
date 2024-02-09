import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { QueueModule } from '@app/queue/queue.module';
import { EffectsModule } from '@ngrx/effects';
import { PlayersModule } from '@app/players/players.module';
import { API_URL } from './api-url';
import { environment } from '@environment';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ProfileModule } from './profile/profile.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { WS_URL } from './ws-url';
import { CoreModule } from './core/core.module';
import { GamesModule } from './games/games.module';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { HallOfFameModule } from './hall-of-fame/hall-of-fame.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { IoModule } from './io/io.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentsModule } from './documents/documents.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,

    StoreModule.forRoot({}),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({ connectInZone: true }),

    MarkdownModule.forRoot(),
    NgxPaginationModule,

    AuthModule,
    IoModule,
    CoreModule,
    PlayersModule,
    QueueModule,
    SharedModule,
    ProfileModule,
    GamesModule,
    HallOfFameModule,
    NotificationsModule,
    DocumentsModule,
  ],
  providers: [
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: WS_URL, useValue: environment.wsUrl },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
