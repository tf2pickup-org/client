import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AcceptRulesDialogComponent } from './accept-rules-dialog.component';
import { By } from '@angular/platform-browser';

describe('AcceptRulesDialogComponent', () => {
  let component: AcceptRulesDialogComponent;
  let fixture: ComponentFixture<AcceptRulesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptRulesDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptRulesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the mumble confirmation button', () => {
    expect(fixture.debugElement.query(By.css('.confirm-mumble-button')).nativeElement).toBeTruthy();
  });

  describe('when the user confirms mumble', () => {
    beforeEach(() => {
      const button = fixture.debugElement.query(By.css('.confirm-mumble-button')).nativeElement as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
    });

    it('should render the accept rules button', () => {
      expect(fixture.debugElement.query(By.css('.accept-rules-button')).nativeElement).toBeTruthy();
    });

    describe('when the user accepts the rules', () => {
      it('should emit rulesAccepted', done => {
        component.rulesAccepted.subscribe(done);

        const button = fixture.debugElement.query(By.css('.accept-rules-button')).nativeElement as HTMLButtonElement;
        button.click();
        fixture.detectChanges();

        expect().nothing();
      });
    });
  });
});
