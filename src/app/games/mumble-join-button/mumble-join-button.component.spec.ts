import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MumbleJoinButtonComponent } from './mumble-join-button.component';
import { SharedModule } from '@app/shared/shared.module';
import { ChangeDetectionStrategy } from '@angular/core';

describe('MumbleJoinButtonComponent', () => {
  let component: MumbleJoinButtonComponent;
  let fixture: ComponentFixture<MumbleJoinButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MumbleJoinButtonComponent ],
      imports: [
        SharedModule,
      ],
      providers: [

      ],
    })
    .overrideComponent(MumbleJoinButtonComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MumbleJoinButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
