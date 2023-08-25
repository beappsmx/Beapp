import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { MainPageComponent } from './main-page/main-page.component';
import { Error404Component } from './main-page/error404/error404.component';

import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'login',  loadChildren: () => import('./login/login.module').then(m=>m.LoginModule)},
  { path: '',
    component: MainPageComponent, canActivate: [AuthGuard],
    children: [
      { path: '', loadChildren: () => import('./main-page/home/home.module').then(m=>m.HomeModule)},
      { path: 'branchs', loadChildren: () => import('./main-page/branchs/branchs.module').then(m=>m.BranchsModule)},
      { path: 'users', loadChildren: () => import('./main-page/users/users.module').then( m=> m.UsersModule)},
      { path: 'companys', loadChildren: () => import('./main-page/companys/companys.module').then( m=> m.CompanysModule)},
      { path: 'interested', loadChildren: () => import('./main-page/interested/interested.module').then( m=> m.InterestedModule)},
      { path: 'communications', loadChildren: () => import('./main-page/communications/communications.module').then( m=> m.CommunicationsModule)},
      { path: 'risk', loadChildren: () => import('./main-page/risk/risk.module').then( m=> m.RiskModule)},
      { path: 'dashboardpmo', loadChildren: () => import('./main-page/dashboardpmo/dashboardpmo.module').then( m=> m.DashboardpmoModule)},
      { path: 'lessons', loadChildren: () => import('./main-page/lessons/lessons.module').then( m=> m.LessonsModule)},
      { path: 'concepts', loadChildren: () => import('./main-page/concepts/concepts.module').then( m=> m.ConceptsModule)},
      { path: 'management', loadChildren: () => import('./main-page/management/management.module').then (m => m.ManagementModule)},
      { path: 'training', loadChildren: () => import ('./main-page/training/training.module'). then (m => m.TrainingModule )},
      { path: '**', component: Error404Component}
    ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }


