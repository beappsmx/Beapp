import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Forzosamente necesita este componente para activar el formulario del inicio en caso nuevo
import {  ReactiveFormsModule } from '@angular/forms';
//import { FormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { PipesModule } from 'src/app/pipes/pipes.module';

import { TranslateModule } from '@ngx-translate/core';
import { UsersComponent } from './users.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';

import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [UsersComponent, NewComponent, EditComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
  //  FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule,
    MatIconModule,
    MatCardModule, MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule,
    MatCheckboxModule,
    MatTooltipModule

  ]
})
export class UsersModule { }
