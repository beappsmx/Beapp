import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonsRoutingModule } from './lessons-routing.module';

import { LessonsComponent } from './lessons.component';
import { NewlessComponent } from './newless/newless.component';

import { TranslateModule } from '@ngx-translate/core';

// Forzosamente necesita este componente para activar el formulario del inicio en caso nuevo, son forzos,
//igual los otros dos si quieres usar angular material
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule} from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [LessonsComponent, NewlessComponent],
  imports: [
    CommonModule,
    LessonsRoutingModule,
    TranslateModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule, ReactiveFormsModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class LessonsModule { }
