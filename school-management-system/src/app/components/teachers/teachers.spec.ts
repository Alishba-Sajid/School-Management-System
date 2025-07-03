import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherComponent } from './teachers.component'; // ✅ Correct import

describe('TeacherComponent', () => {
  let component: TeacherComponent;
  let fixture: ComponentFixture<TeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherComponent] // ✅ If standalone
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
