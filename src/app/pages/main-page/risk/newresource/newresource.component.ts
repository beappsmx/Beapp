import { Component, OnInit, Inject  } from '@angular/core';
import { TrackingService } from 'src/app/services/tracking.service';

import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-newresource',
  templateUrl: './newresource.component.html',
  styleUrls: ['./newresource.component.css']
})
export class NewresourceComponent {

  units           : string[] = ['h','pza','m','g','kg','ton'];
  resources       : any[] = [];

  public faction = this.formBuilder.group({
    id_resource     : '',
    id_action       : '',
    rdescription    : '',
    unit            : '',
    quantity        : '',
    cost            : '',
    total_cost      : 0

  })

  constructor(
    private trackingService: TrackingService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewresourceComponent >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {



  }

  addResource(): void{

    const resource = {
      rdescription: this.faction.controls.rdescription.value,
      quantity: this.faction.controls.quantity.value,
      unit: this.faction.controls.unit.value,
      cost: this.faction.controls.cost.value,
    };
    this.resources.push(resource);

    this.faction.controls.rdescription.patchValue('');
    this.faction.controls.quantity.patchValue('');
    this.faction.controls.unit.patchValue('');
    this.faction.controls.cost.patchValue('');
  }

  deleteResource(index: number): void {
    this.resources.splice(index, 1);
  }

  sumResource(): number {
    return this.resources.reduce((sum, res) => sum + res.cost, 0);
  }

  saveRisk(){


  }
}
