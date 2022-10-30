import { PlayersService } from '@app/players/players.service';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { ImportExportPlayerSkillComponent } from './import-export-player-skill.component';

describe('ImportExportPlayerSkillComponent', () => {
  let component: ImportExportPlayerSkillComponent;
  let fixture: MockedComponentFixture<ImportExportPlayerSkillComponent>;

  beforeEach(() =>
    MockBuilder(ImportExportPlayerSkillComponent).mock(PlayersService),
  );

  beforeEach(() => {
    fixture = MockRender(ImportExportPlayerSkillComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO write tests
});
