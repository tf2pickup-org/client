import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { PlayersService } from '@app/players/players.service';
import { catchError, first, switchMap } from 'rxjs';

interface ImportExportPlayerSkillState {
  file?: File;
  noImported?: number;
  error?: string;
  isUploading: boolean;
}

const initialState: ImportExportPlayerSkillState = {
  isUploading: false,
};

@Injectable()
export class ImportExportPlayerSkillStore extends ComponentStore<ImportExportPlayerSkillState> {
  readonly file = this.select(state => state.file);
  readonly noImported = this.select(state => state.noImported);
  readonly error = this.select(state => state.error);
  readonly isUploading = this.select(state => state.isUploading);

  setSkillFile = this.updater(
    (state, file: File): ImportExportPlayerSkillState => ({
      ...state,
      file,
    }),
  );

  private setIsUploading = this.updater(
    (state, isUploading: boolean): ImportExportPlayerSkillState => ({
      ...state,
      isUploading,
    }),
  );

  private setResult = this.updater(
    (state, noImported: number): ImportExportPlayerSkillState => ({
      ...state,
      noImported,
    }),
  );

  private setError = this.updater(
    (state, error: string): ImportExportPlayerSkillState => ({
      ...state,
      error,
    }),
  );

  constructor(private readonly playersService: PlayersService) {
    super(initialState);
  }

  importSkills() {
    this.setIsUploading(true);
    this.file
      .pipe(
        first(Boolean),
        switchMap(file => this.playersService.importPlayerSkill(file)),
      )
      .subscribe({
        next: response => this.setResult(response.noImported),
        error: error => this.setError(error.error.message),
        complete: () => {
          this.setSkillFile(undefined);
          this.setIsUploading(false);
        },
      });
  }
}
