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
import { ModalModule } from 'ngx-bootstrap/modal';
import { GamesModule } from './games/games.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { GameServersModule } from './game-servers/game-servers.module';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgxPaginationModule } from 'ngx-pagination';
import { HallOfFameModule } from './hall-of-fame/hall-of-fame.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([]),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    InlineSVGModule.forRoot(),
    ButtonsModule.forRoot(),
    NgxPaginationModule,

    AuthModule,
    CoreModule,
    PlayersModule,
    QueueModule,
    SharedModule,
    ProfileModule,
    GamesModule,
    GameServersModule,
    HallOfFameModule,
    NotificationsModule,
  ],
  providers: [
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: WS_URL, useValue: environment.wsUrl },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
