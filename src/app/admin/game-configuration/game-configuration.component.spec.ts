import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { Subject } from 'rxjs';
import { GameConfigurationComponent } from './game-configuration.component';

describe('GameConfigurationComponent', () => {
  let component: GameConfigurationComponent;
  let fixture: MockedComponentFixture<GameConfigurationComponent>;

  beforeEach(() =>
    MockBuilder(GameConfigurationComponent)
      .keep(ReactiveFormsModule)
      .keep(FormBuilder)
      .mock(ConfigurationService)
      .keep(ChangeDetectorRef)
      .mock(Location)
      .mock(ActivatedRoute, {
        data: new Subject(),
      }),
  );

  beforeEach(() => {
    fixture = MockRender(GameConfigurationComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
