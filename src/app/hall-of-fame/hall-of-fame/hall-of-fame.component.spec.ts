import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HallOfFameComponent } from './hall-of-fame.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NEVER } from 'rxjs';
import { HallOfFameService } from '../hall-of-fame.service';

describe('HallOfFameComponent', () => {
  let component: HallOfFameComponent;
  let fixture: ComponentFixture<HallOfFameComponent>;
  let hallOfFameService: jasmine.SpyObj<HallOfFameService>;

  beforeEach(() => {
    hallOfFameService = jasmine.createSpyObj<HallOfFameService>(
      HallOfFameService.name,
      ['fetchHallOfFames'],
    );
    hallOfFameService.fetchHallOfFames.and.returnValue(NEVER);
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HallOfFameComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: HallOfFameService, useValue: hallOfFameService },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HallOfFameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the hall of fame', () => {
    expect(hallOfFameService.fetchHallOfFames).toHaveBeenCalledTimes(1);
  });
});
