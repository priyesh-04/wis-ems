import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHolidaysFormComponent } from './public-holidays-form.component';

describe('PublicHolidaysFormComponent', () => {
  let component: PublicHolidaysFormComponent;
  let fixture: ComponentFixture<PublicHolidaysFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicHolidaysFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicHolidaysFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
