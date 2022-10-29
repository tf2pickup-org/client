import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-import-export-player-skill',
  templateUrl: './import-export-player-skill.component.html',
  styleUrls: ['./import-export-player-skill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportExportPlayerSkillComponent {
  fileName: string;

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;

      const formData = new FormData();
      formData.append('skills', file);
    }
  }
}
