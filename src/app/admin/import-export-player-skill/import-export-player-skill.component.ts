import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportExportPlayerSkillStore } from './import-export-player-skill.store';

@Component({
  selector: 'app-import-export-player-skill',
  templateUrl: './import-export-player-skill.component.html',
  styleUrls: ['./import-export-player-skill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ImportExportPlayerSkillStore],
})
export class ImportExportPlayerSkillComponent {
  constructor(public readonly store: ImportExportPlayerSkillStore) {}

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.store.setSkillFile(file);
    }
  }
}
