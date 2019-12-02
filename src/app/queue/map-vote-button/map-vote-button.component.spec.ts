import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapVoteButtonComponent } from './map-vote-button.component';

describe('MapVoteButtonComponent', () => {
  let component: MapVoteButtonComponent;
  let fixture: ComponentFixture<MapVoteButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapVoteButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapVoteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
