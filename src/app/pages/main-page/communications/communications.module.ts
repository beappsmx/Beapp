import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicationsComponent } from './communications.component';
import { NewcommunicComponent } from './newcommunic/newcommunic.component';
import { EditcommunicComponent } from './editcommunic/editcommunic.component';
import { NewfollowcomComponent } from './newfollowcom/newfollowcom.component';

import { TranslateModule } from '@ngx-translate/core';

import { CommunicationsRoutingModule } from './communications.routing';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material/core';
import { MatInputModule} from '@angular/material/input';
import { MatStepperModule} from '@angular/material/stepper';
import { MatListModule} from '@angular/material/list';
import { MatDividerModule} from '@angular/material/divider';
import { MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [CommunicationsComponent, NewcommunicComponent, EditcommunicComponent, NewfollowcomComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CommunicationsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatStepperModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule

  ]
})


export class CommunicationsModule {

 }

