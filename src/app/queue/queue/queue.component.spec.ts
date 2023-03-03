import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueComponent } from './queue.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { queueConfig } from '../queue.selectors';
import { MockComponent } from 'ng-mocks';
import { QueueClassSlotListComponent } from '../queue-class-slot-list/queue-class-slot-list.component';
import { By } from '@angular/platform-browser';
import { GameClassIconComponent } from '@app/shared/game-class-icon/game-class-icon.component';
import { QueueConfig } from '../models/queue-config';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

const config6v6: QueueConfig = {
  teamCount: 2,
  classes: [
    { name: Tf2ClassName.scout, count: 2 },
    { name: Tf2ClassName.soldier, count: 2 },
    { name: Tf2ClassName.demoman, count: 1 },
    { name: Tf2ClassName.medic, count: 1 },
  ],
};

const config9v9: QueueConfig = {
  teamCount: 2,
  classes: [
    { name: Tf2ClassName.scout, count: 1 },
    { name: Tf2ClassName.soldier, count: 1 },
    { name: Tf2ClassName.pyro, count: 1 },
    { name: Tf2ClassName.demoman, count: 1 },
    { name: Tf2ClassName.heavy, count: 1 },
    { name: Tf2ClassName.engineer, count: 1 },
    { name: Tf2ClassName.medic, count: 1 },
    { name: Tf2ClassName.sniper, count: 1 },
    { name: Tf2ClassName.spy, count: 1 },
  ],
};

describe('QueueComponent', () => {
  let component: QueueComponent;
  let fixture: ComponentFixture<QueueComponent>;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueComponent,
        MockComponent(QueueClassSlotListComponent),
        MockComponent(GameClassIconComponent),
      ],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(queueConfig, config6v6);

    fixture = TestBed.createComponent(QueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the QueueClassSlotListComponent instance', () => {
    const queueClassSlotListComponent = fixture.debugElement.query(
      By.css('app-queue-class-slot-list'),
    ).componentInstance;
    expect(queueClassSlotListComponent).toBeTruthy();
  });

  describe('for 6v6', () => {
    it('should apply 4x1 grid', () => {
      const div = fixture.debugElement.query(By.css('div.grid'))
        .nativeElement as HTMLElement;
      expect(div.classList.contains('lg:grid-cols-4')).toBe(true);
    });
  });

  describe('for 9v9', () => {
    beforeEach(() => {
      queueConfig.setResult(config9v9);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should apply 3x3 grid', () => {
      const div = fixture.debugElement.query(By.css('div.grid'))
        .nativeElement as HTMLElement;
      expect(div.classList.contains('lg:grid-cols-3')).toBe(true);
    });
  });
});
