import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtrackingComponent } from './newtracking.component';

describe('NewtrackingComponent', () => {
  let component: NewtrackingComponent;
  let fixture: ComponentFixture<NewtrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewtrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewtrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
