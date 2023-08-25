import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { BranchsComponent } from './branchs.component';

const routes: Routes = [
	{ path: '', component: BranchsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchsRoutingModule { }
