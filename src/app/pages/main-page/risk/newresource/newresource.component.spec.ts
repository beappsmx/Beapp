import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewresourceComponent } from './newresource.component';

describe('NewresourceComponent', () => {
  let component: NewresourceComponent;
  let fixture: ComponentFixture<NewresourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewresourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
