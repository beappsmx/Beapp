import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardpmoComponent } from './dashboardpmo.component';

describe('DashboardpmoComponent', () => {
  let component: DashboardpmoComponent;
  let fixture: ComponentFixture<DashboardpmoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardpmoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardpmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
