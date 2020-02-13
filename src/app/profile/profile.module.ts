import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './profile.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProfileEffects } from './profile.effects';
import { AcceptRulesDialogComponent } from './accept-rules-dialog/accept-rules-dialog.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    AcceptRulesDialogComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('profile', reducer),
    EffectsModule.forFeature([ProfileEffects]),
    MarkdownModule.forChild(),
  ],
})
export class ProfileModule { }
