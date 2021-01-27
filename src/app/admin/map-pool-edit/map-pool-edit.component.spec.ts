import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPoolEditComponent } from './map-pool-edit.component';

describe('MapPoolEditComponent', () => {
  let component: MapPoolEditComponent;
  let fixture: ComponentFixture<MapPoolEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPoolEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPoolEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
