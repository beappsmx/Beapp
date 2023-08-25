import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditriskComponent } from './editrisk.component';

describe('EditriskComponent', () => {
  let component: EditriskComponent;
  let fixture: ComponentFixture<EditriskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditriskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditriskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
