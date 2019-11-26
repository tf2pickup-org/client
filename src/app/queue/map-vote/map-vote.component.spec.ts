import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapVoteComponent } from './map-vote.component';

describe('MapVoteComponent', () => {
  let component: MapVoteComponent;
  let fixture: ComponentFixture<MapVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
