import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminItemListComponent } from './admin-item-list.component';

describe('AdminItemListComponent', () => {
  let component: AdminItemListComponent;
  let fixture: ComponentFixture<AdminItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminItemListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
