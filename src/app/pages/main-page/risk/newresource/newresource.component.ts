import { Component, OnInit, Inject  } from '@angular/core';
import { TrackingService } from 'src/app/services/tracking.service';
import { RiskService } from 'src/app/services/risk.service';
import { Irisk, Iactions } from 'src/app/interface/irisk';
import { alerts } from 'src/app/helpers/alerts';

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
    total_cost      : 0,
    id_risk         : '',
    pos             : 0,
    adescription    : '',
    startDate       : '',
    endDate         : '',
    monitoring_date : '',
    lastTrackingDate: '',
    sum_progress    : 0,
  });

  get total_cost()       { return this.faction.get('total_cost') }
  get id_risk()          { return this.faction.get('id_risk') }
  get pos()              { return this.faction.get('pos') }
  get adescription()     { return this.faction.get('adescription') }
  get startDate()        { return this.faction.get('startDate') }
  get endDate()          { return this.faction.get('endDate') }
  get monitoring_date()  { return this.faction.get('monitoring_date') }
  get lastTrackingDate() { return this.faction.get('lastTrackingDate') }
  get sum_progress()     { return this.faction.get('sum_progress') }

  constructor(
    private trackingService: TrackingService,
    private riskServices: RiskService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewresourceComponent >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.riskServices.getActionResources(this.data.id)
    .then(data => {
      this.resources = data;
    });

    this.riskServices.getAction(this.data.id).subscribe(
      (resp: any) => {
        this.id_risk.setValue(resp.id_risk);
        this.pos.setValue(resp.pos);
        this.adescription.setValue(resp.adescription);
        this.startDate.setValue(resp.startDate);
        this.endDate.setValue(resp.endDate);
        this.monitoring_date.setValue(resp.monitoring_date);
        this.lastTrackingDate.setValue(resp.lastTrackingDate);
        this.sum_progress.setValue(resp.sum_progress);
        this.total_cost.setValue(resp.total_cost);
      }
    );
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

    const dataActions: Iactions = {

      id_risk         : this.faction.get('id_risk').value ?? '',
      pos             : this.faction.get('pos').value ?? 0,
      adescription    : this.faction.get('adescription').value ?? '',
      startDate       : this.faction.get('startDate').value ?? '',
      endDate         : this.faction.get('endDate').value ?? '',
      monitoring_date : this.faction.get('monitoring_date').value ?? '',
      lastTrackingDate: this.faction.get('lastTrackingDate').value ?? '',
      total_cost      : this.sumResource() ?? 0,
      sum_progress    : this.faction.get('sum_progress').value ?? 0,

    }
    this.riskServices.patchDataAction(this.data.id, dataActions, localStorage.getItem('token')).subscribe(
    resp => {
      this.riskServices.deleteActionresByRiskId(this.data.id, localStorage.getItem('token'));
      this.saveActionres(this.data.id);

    },
    err => {

      alerts.basicAlert("Error", 'Action saving error', "error")

    })
  }

  saveActionres(key: string){
    this.resources.forEach((res, index) => {

      const aresource = {
        id_action    : key,
        rdescription : res.rdescription,
        unit         : res.unit,
        quantity     : res.quantity,
        cost         : res.cost,
      };
      this.riskServices.postSelActionres(aresource, localStorage.getItem('token')).subscribe(
        (resp: any) => {
          // Resto del código para guardar los detalles del interesado
        }
      );
    });
  }
}
