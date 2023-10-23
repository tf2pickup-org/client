import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordComponent } from './discord.component';

describe('DiscordComponent', () => {
  let component: DiscordComponent;
  let fixture: ComponentFixture<DiscordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
