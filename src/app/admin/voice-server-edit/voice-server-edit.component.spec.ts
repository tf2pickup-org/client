import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceServerEditComponent } from './voice-server-edit.component';

describe('VoiceServerEditComponent', () => {
  let component: VoiceServerEditComponent;
  let fixture: ComponentFixture<VoiceServerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceServerEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceServerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
