import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//componentes
import { HomeComponent } from './home.component';

//routing
import { HomeRoutingModule} from "./home.routing.module";



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
