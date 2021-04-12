import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SettingsComponent } from './settings.component';
import { Location } from '@angular/common';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user presses the cancel button', () => {
    let cancelButton: HTMLButtonElement;

    beforeEach(() => {
      cancelButton = fixture.debugElement.query(By.css('.cancel-button'))
        .nativeElement as HTMLButtonElement;
    });

    it('should go back in history', () => {
      const spy = spyOn(TestBed.inject(Location), 'back');
      cancelButton.click();
      expect(spy).toHaveBeenCalled();
    });
  });
});
