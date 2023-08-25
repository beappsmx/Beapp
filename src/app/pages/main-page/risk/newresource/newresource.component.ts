import { Component } from '@angular/core';
import { TrackingService } from 'src/app/services/tracking.service';

import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-newresource',
  templateUrl: './newresource.component.html',
  styleUrls: ['./newresource.component.css']
})
export class NewresourceComponent {

  public frisk = this.formBuilder.group({
    active        :  1,

  })

  constructor(
    private trackingService: TrackingService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewresourceComponent >
  ) { }

  ngOnInit() {



  }

  saveRisk(){

  }
}
