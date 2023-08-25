import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewriskComponent } from './newrisk.component';

describe('NewriskComponent', () => {
  let component: NewriskComponent;
  let fixture: ComponentFixture<NewriskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewriskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewriskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
