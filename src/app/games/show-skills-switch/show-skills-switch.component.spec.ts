import { Component, EventEmitter } from '@angular/core';
import { TablerIconComponent } from 'angular-tabler-icons';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { ShowSkillsSwitchComponent } from './show-skills-switch.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-wrapper',
  template:
    '<app-show-skills-switch [showSkills]="showSkills" (showSkillsToggle)="showSkillsToggle.emit($event)"></app-show-skills-switch>',
})
class TestWrapperComponent {
  showSkills = false;
  showSkillsToggle = new EventEmitter<boolean>();
  toggle() {
    // do nothing.
  }
}

describe('ShowSkillsSwitchComponent', () => {
  let component: TestWrapperComponent;
  let fixture: MockedComponentFixture<ShowSkillsSwitchComponent>;

  beforeEach(() =>
    MockBuilder(TestWrapperComponent)
      .keep(ShowSkillsSwitchComponent)
      .mock(TablerIconComponent),
  );

  beforeEach(() => {
    fixture = MockRender(TestWrapperComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when on', () => {
    beforeEach(() => {
      component.showSkills = true;
      fixture.detectChanges();
    });

    it('should set eye icon', () => {
      const icon = ngMocks.find(TablerIconComponent).componentInstance;
      expect(icon.name).toEqual('eye');
    });

    describe('when clicked', () => {
      it('should emit toggle', () => {
        let toggled = false;
        component.showSkillsToggle.subscribe(() => (toggled = true));

        const button = ngMocks.find('button')
          .nativeElement as HTMLButtonElement;
        button.click();

        expect(toggled).toBe(true);
      });
    });
  });

  describe('when off', () => {
    beforeEach(() => {
      component.showSkills = false;
      fixture.detectChanges();
    });

    it('should set eye-off icon', () => {
      const icon = ngMocks.find(TablerIconComponent).componentInstance;
      expect(icon.name).toEqual('eye-off');
    });

    describe('when clicked', () => {
      it('should emit toggle', () => {
        let toggled = false;
        component.showSkillsToggle.subscribe(() => (toggled = true));

        const button = ngMocks.find('button')
          .nativeElement as HTMLButtonElement;
        button.click();

        expect(toggled).toBe(true);
      });
    });
  });
});
