import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core'

import { ManagementComponent } from './management.component';
import { NewFileComponent } from './newFile/newFile.component';
import { EditFileComponent } from './editFile/editFile.component';
import { ManagementRoutingModule } from './management-routing.module';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ManagementComponent, NewFileComponent, EditFileComponent],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule, MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule

  ]
})
export class ManagementModule { }
