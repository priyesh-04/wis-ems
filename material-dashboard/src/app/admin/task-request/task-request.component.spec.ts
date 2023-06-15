import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRequestComponent } from './task-request.component';

describe('TaskRequestComponent', () => {
  let component: TaskRequestComponent;
  let fixture: ComponentFixture<TaskRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
