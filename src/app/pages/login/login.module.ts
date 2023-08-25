import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

//ruta
import { LoginRoutingModule } from './login-routing.module';

import { TranslateService} from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule, 
    TranslateModule  
  ]

})
export class LoginModule { }
