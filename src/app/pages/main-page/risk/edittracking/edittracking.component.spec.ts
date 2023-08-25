import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdittrackingComponent } from './edittracking.component';

describe('EdittrackingComponent', () => {
  let component: EdittrackingComponent;
  let fixture: ComponentFixture<EdittrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdittrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdittrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
