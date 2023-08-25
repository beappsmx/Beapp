import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewactionComponent } from './newaction.component';

describe('NewactionComponent', () => {
  let component: NewactionComponent;
  let fixture: ComponentFixture<NewactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
