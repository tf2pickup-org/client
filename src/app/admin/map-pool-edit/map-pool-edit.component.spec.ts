import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Map } from '@app/queue/models/map';
import { QueueService } from '@app/queue/queue.service';
import { AsFormGroupPipe } from '@app/shared/as-form-group.pipe';
import { FeatherComponent } from 'angular-feather';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject } from 'rxjs';
import { EditPageWrapperComponent } from '../edit-page-wrapper/edit-page-wrapper.component';
import { MapEditComponent } from '../map-edit/map-edit.component';
import { MapPoolEditComponent } from './map-pool-edit.component';

describe(MapPoolEditComponent.name, () => {
  let component: MapPoolEditComponent;
  let fixture: MockedComponentFixture<MapPoolEditComponent>;
  let queueService: jasmine.SpyObj<QueueService>;
  let maps: Subject<Map[]>;
  let submitButton: HTMLButtonElement;

  beforeEach(() => {
    maps = new Subject();
  });

  beforeEach(() =>
    MockBuilder(MapPoolEditComponent)
      .keep(ReactiveFormsModule)
      .keep(FormBuilder)
      .mock(QueueService, {
        fetchMaps: () => maps.asObservable(),
        setMaps: jasmine
          .createSpy('setMaps')
          .and.returnValue(maps.asObservable()),
      })
      .keep(EditPageWrapperComponent)
      .keep(MapEditComponent)
      .keep(AsFormGroupPipe)
      .mock(FeatherComponent),
  );

  beforeEach(() => {
    fixture = MockRender(MapPoolEditComponent);
    component = fixture.point.componentInstance;

    fixture.detectChanges();

    queueService = TestBed.inject(QueueService) as jasmine.SpyObj<QueueService>;
    submitButton = ngMocks.find('button[type=submit]').nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable submit button initially', () => {
    expect(submitButton.disabled).toBe(true);
  });

  describe('when maps are loaded', () => {
    beforeEach(async () => {
      maps.next([{ name: 'cp_process_final' }, { name: 'cp_badlands' }]);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should render map edits', () => {
      const mapEdits = ngMocks.findAll('app-map-edit');
      expect(mapEdits.length).toEqual(2);
    });

    it('should keep the submit button disabled', () => {
      expect(submitButton.disabled).toBe(true);
    });

    describe('when a new map is added', () => {
      beforeEach(() => {
        const addButton = ngMocks.find('.add-map-button')
          .nativeElement as HTMLButtonElement;
        addButton.click();
        fixture.detectChanges();
      });

      it('should add MapEditComponent', () => {
        const mapEdits = ngMocks.findAll('app-map-edit');
        expect(mapEdits.length).toEqual(3);
      });

      describe('when the new map is valid', () => {
        beforeEach(() => {
          const input = ngMocks.findAll('input.map-name-input')[2]
            .nativeElement as HTMLInputElement;
          input.value = 'cp_snakewater_final1';
          input.dispatchEvent(new Event('input'));
          fixture.detectChanges();
        });

        it('should enable the submit button', () => {
          expect(submitButton.disabled).toBe(false);
        });

        describe('when saved', () => {
          beforeEach(() => {
            submitButton.click();
            fixture.detectChanges();
          });

          it('should save the maps', () => {
            expect(queueService.setMaps).toHaveBeenCalledWith([
              { name: 'cp_process_final', execConfig: null },
              { name: 'cp_badlands', execConfig: null },
              { name: 'cp_snakewater_final1', execConfig: null },
            ]);
          });

          it('should disable the submit button again', () => {
            expect(submitButton.disabled).toBe(true);
          });
        });
      });
    });

    describe('when a map is removed', () => {
      beforeEach(() => {
        const removeMapButton = ngMocks.find('button.remove-map-button')
          .nativeElement as HTMLButtonElement;
        removeMapButton.click();
        fixture.detectChanges();
      });

      it('should enable the submit button', () => {
        expect(submitButton.disabled).toBe(false);
      });

      describe('when saved', () => {
        beforeEach(() => {
          submitButton.click();
        });

        it('should save the maps', () => {
          expect(queueService.setMaps).toHaveBeenCalledWith([
            { name: 'cp_badlands', execConfig: null },
          ]);
        });
      });
    });
  });
});
