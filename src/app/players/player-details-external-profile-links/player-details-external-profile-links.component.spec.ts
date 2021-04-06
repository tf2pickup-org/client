import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDetailsExternalProfileLinksComponent } from './player-details-external-profile-links.component';

describe('PlayerDetailsExternalProfileLinksComponent', () => {
  let component: PlayerDetailsExternalProfileLinksComponent;
  let fixture: ComponentFixture<PlayerDetailsExternalProfileLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerDetailsExternalProfileLinksComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      PlayerDetailsExternalProfileLinksComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
