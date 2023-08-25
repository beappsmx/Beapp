/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewcommunicComponent } from './newcommunic.component';

describe('NewcommunicComponent', () => {
  let component: NewcommunicComponent;
  let fixture: ComponentFixture<NewcommunicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcommunicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcommunicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
