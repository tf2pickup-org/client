import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExportPlayerSkillComponent } from './import-export-player-skill.component';

describe('ImportExportPlayerSkillComponent', () => {
  let component: ImportExportPlayerSkillComponent;
  let fixture: ComponentFixture<ImportExportPlayerSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportExportPlayerSkillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExportPlayerSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
