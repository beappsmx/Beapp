import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptsRoutingModule } from './concepts-routing.module';
import { ConceptsComponent } from './concepts.component';

import { TranslateModule } from '@ngx-translate/core';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [ConceptsComponent],
  imports: [
    CommonModule,
    ConceptsRoutingModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule
  ]
})
export class ConceptsModule { }
