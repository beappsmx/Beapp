import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewfollowcomComponent } from './newfollowcom.component';

describe('NewfollowcomComponent', () => {
  let component: NewfollowcomComponent;
  let fixture: ComponentFixture<NewfollowcomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewfollowcomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewfollowcomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
