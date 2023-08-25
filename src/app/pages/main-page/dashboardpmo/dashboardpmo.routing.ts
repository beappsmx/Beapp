import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardpmoComponent } from './dashboardpmo.component';

const routes: Routes = [
   {path: '', component: DashboardpmoComponent  }
];

@NgModule ({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})

export class DashboardpmoRoutingModule {}
