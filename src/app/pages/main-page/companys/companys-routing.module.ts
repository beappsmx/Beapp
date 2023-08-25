import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { CompanysComponent } from './companys.component';

const routes: Routes = [
	{ path: '', component: CompanysComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanysRoutingModule { }
