import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanysRoutingModule } from './companys-routing.module';

import { CompanysComponent } from './companys.component';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// Forzosamente necesita este componente para activar el formulario del inicio en caso nuevo, son forzos,
//igual los otros dos si quieres usar angular material
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CompanysComponent],
  imports: [
    CommonModule,
    CompanysRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ]
})
export class CompanysModule { }
