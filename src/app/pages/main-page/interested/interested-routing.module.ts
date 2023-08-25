import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { InterestedComponent } from './interested.component';

const routes: Routes = [
	{ path: '', component: InterestedComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterestedRoutingModule { }
