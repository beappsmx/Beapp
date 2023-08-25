import { Component } from '@angular/core';

import { TrackingService } from 'src/app/services/tracking.service';

import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edittracking',
  templateUrl: './edittracking.component.html',
  styleUrls: ['./edittracking.component.css']
})
export class EdittrackingComponent {

  public fedttracking = this.formBuilder.group({
    active        :  1,

  })

  constructor(
    private trackingService: TrackingService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EdittrackingComponent >
  ) { }

  ngOnInit() {



  }

  editTracking(){

  }
}
