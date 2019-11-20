import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleControllerComponent } from './title-controller.component';

describe('TitleControllerComponent', () => {
  let component: TitleControllerComponent;
  let fixture: ComponentFixture<TitleControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
