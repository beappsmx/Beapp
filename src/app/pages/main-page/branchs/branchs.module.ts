import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//ruta
import { BranchsRoutingModule } from './branchs-routing.module';

//componente
import { BranchsComponent } from './branchs.component';
import { NewBranchComponent } from './new-branch/new-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch.component';
import { DeleteBranchsComponent } from './delete-branchs/delete-branchs.component';


//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations:[BranchsComponent, NewBranchComponent, EditBranchComponent, DeleteBranchsComponent],
  imports: [
    CommonModule,
    BranchsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatDialogModule, ReactiveFormsModule
  ]
})
export class BranchsModule { }
