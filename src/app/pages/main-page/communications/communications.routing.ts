import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componentes
import { CommunicationsComponent } from './communications.component';

const routes: Routes = [
   {path: '', component: CommunicationsComponent  }
];

@NgModule ({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})

export class CommunicationsRoutingModule {}
