import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditactionComponent } from './editaction.component';

describe('EditactionComponent', () => {
  let component: EditactionComponent;
  let fixture: ComponentFixture<EditactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
