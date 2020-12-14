import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPlayerRolesComponent } from './edit-player-roles.component';

describe('EditPlayerRolesComponent', () => {
  let component: EditPlayerRolesComponent;
  let fixture: ComponentFixture<EditPlayerRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPlayerRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlayerRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
