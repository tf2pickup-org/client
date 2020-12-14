import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { PlayerEditComponent } from './player-edit/player-edit.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerBansComponent } from './player-bans/player-bans.component';
import { AddPlayerBanComponent } from './add-player-ban/add-player-ban.component';
import { SkillTableComponent } from './skill-table/skill-table.component';
import { IsAdminGuard } from '@app/auth/is-admin.guard';
import { EditPlayerRolesComponent } from './edit-player-roles/edit-player-roles.component';

const routes: Routes = [
  { path: 'players', component: PlayerListComponent, data: { title: 'players', animation: 'PlayerListPage' } },
  { path: 'player/:id', component: PlayerDetailsComponent, data: { animation: 'PlayerDetailsPage' } },
  { path: 'player/:id/edit', component: PlayerEditComponent, data: { animation: 'PlayerEditPage' } },
  { path: 'player/:id/bans', component: PlayerBansComponent, data: { animation: 'PlayerBansPage' } },
  { path: 'player/:id/bans/add', component: AddPlayerBanComponent, data: { animation: 'AddPlayerBanPage' } },
  { path: 'player/:id/roles', component: EditPlayerRolesComponent, data: { animation: 'EditPlayerRolesPage' } },
  { path: 'player-skill-dump', component: SkillTableComponent, canActivate: [ IsAdminGuard ], data: { title: 'player skills' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayersRoutingModule { }
