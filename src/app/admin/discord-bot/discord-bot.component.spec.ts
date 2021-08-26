import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordBotComponent } from './discord-bot.component';

describe('DiscordBotComponent', () => {
  let component: DiscordBotComponent;
  let fixture: ComponentFixture<DiscordBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscordBotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscordBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
