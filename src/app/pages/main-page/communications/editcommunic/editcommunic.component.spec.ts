import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcommunicComponent } from './editcommunic.component';

describe('EditcommunicComponent', () => {
  let component: EditcommunicComponent;
  let fixture: ComponentFixture<EditcommunicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditcommunicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditcommunicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
