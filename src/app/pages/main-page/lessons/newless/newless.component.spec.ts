/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewlessComponent } from './newless.component';

describe('NewlessComponent', () => {
  let component: NewlessComponent;
  let fixture: ComponentFixture<NewlessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewlessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewlessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
