import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HallOfFameComponent } from './hall-of-fame.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { Title } from '@angular/platform-browser';
import { NEVER } from 'rxjs';
import { HallOfFameService } from '../hall-of-fame.service';

class TitleStub {
  setTitle(title: string) { }
}

class HallOfFameServiceStub {
  fetchHallOfFames() { return NEVER; }
}

describe('HallOfFameComponent', () => {
  let component: HallOfFameComponent;
  let fixture: ComponentFixture<HallOfFameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HallOfFameComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: API_URL, useValue: 'FAKE_URL' },
        { provide: Title, useClass: TitleStub },
        { provide: HallOfFameService, useClass: HallOfFameServiceStub },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HallOfFameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit()', () => {
    it('should set title', () => {
      const spy = spyOn(TestBed.get(Title), 'setTitle');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('should call HallOfFameService.fetchHallOfFame()', () => {
      const spy = spyOn(TestBed.get(HallOfFameService), 'fetchHallOfFames');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
