import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

//ruta
import { LoginRoutingModule } from './login-routing.module';

import { TranslateService} from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule
  ]

})
export class LoginModule { }
