import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskComponent } from './risk.component';
import { RiskRoutingModule } from './risk.routing';

import { TranslateModule } from '@ngx-translate/core';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatSlideToggleModule, _MatSlideToggleRequiredValidatorModule} from '@angular/material/slide-toggle';
import { MatTooltipModule} from '@angular/material/tooltip';
import { NewriskComponent } from './newrisk/newrisk.component';
import { EditriskComponent } from './editrisk/editrisk.component';
import { NewactionComponent } from './newaction/newaction.component';
import { EditactionComponent } from './editaction/editaction.component';
import { NewtrackingComponent } from './newtracking/newtracking.component';
import { EdittrackingComponent } from './edittracking/edittracking.component';
import { NewresourceComponent } from './newresource/newresource.component';


@NgModule({
  declarations: [RiskComponent, NewriskComponent, EditriskComponent, NewactionComponent, EditactionComponent, NewtrackingComponent, EdittrackingComponent, NewresourceComponent],
  imports: [
    CommonModule,
    RiskRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    TranslateModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatStepperModule,
    MatDividerModule,
    MatListModule,
    MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule,
    MatTooltipModule

  ]
})
export class RiskModule { }
