import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBranchsComponent } from './delete-branchs.component';

describe('DeleteBranchsComponent', () => {
  let component: DeleteBranchsComponent;
  let fixture: ComponentFixture<DeleteBranchsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBranchsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteBranchsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
