import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassLectures } from './class-lectures';

describe('ClassLectures', () => {
  let component: ClassLectures;
  let fixture: ComponentFixture<ClassLectures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassLectures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassLectures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
