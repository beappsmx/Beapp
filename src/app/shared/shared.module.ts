import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';

//rutas
import { RouterModule } from '@angular/router';

// Forzosamente necesitas el FormsModule para los Dropdown de la entrada
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';


import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [NavBarComponent, FooterComponent, SideBarComponent],
  exports     : [NavBarComponent, FooterComponent, SideBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatExpansionModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule, MatMenuModule, MatIconModule,
    TranslateModule
  ]
})
export class SharedModule { }
