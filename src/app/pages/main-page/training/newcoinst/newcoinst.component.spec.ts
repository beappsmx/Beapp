/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewcoinstComponent } from './newcoinst.component';

describe('NewcoinstComponent', () => {
  let component: NewcoinstComponent;
  let fixture: ComponentFixture<NewcoinstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcoinstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcoinstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
