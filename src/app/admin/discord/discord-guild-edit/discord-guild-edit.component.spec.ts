import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordGuildEditComponent } from './discord-guild-edit.component';

describe('DiscordGuildEditComponent', () => {
  let component: DiscordGuildEditComponent;
  let fixture: ComponentFixture<DiscordGuildEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscordGuildEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscordGuildEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
