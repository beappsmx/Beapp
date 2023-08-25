import { Component, OnInit, Inject } from '@angular/core';
import { TrackingService } from 'src/app/services/tracking.service';
import { RiskService } from 'src/app/services/risk.service';
import { Iactions, Itrackingrisk } from 'src/app/interface/irisk';

import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-newtracking',
  templateUrl: './newtracking.component.html',
  styleUrls: ['./newtracking.component.css']
})
export class NewtrackingComponent {

  percent         : number[] = [0.05, 0.10, 0.25, 0.50, 1.00];
  fechaFormateada : string;
  fechaActual     = new Date();
  loadData        = false;
  formSubmitted   = false;

  public ftracking = this.formBuilder.group({
    id_action       : '',
    reg_date        : '',
    observations    : ['', Validators.required],
    progress        : [0, Validators.required],
    scheduled_prog  : 0,
    id_risk         : '',
    pos             : 0,
    adescription    : '',
    monitoring_date : '',
    total_cost      : 0,
    sum_progress    : 0 ,
    lastTrackingDate: '',
    startDate       : '',
    endDate         : '',
  });
  get id_risk()         { return this.ftracking.get('id_risk') }
  get pos()             { return this.ftracking.get('pos') }
  get adescription()    { return this.ftracking.get('adescription') }
  get monitoring_date() { return this.ftracking.get('monitoring_date') }
  get total_cost()      { return this.ftracking.get('total_cost') }
  get sum_progress()    { return this.ftracking.get('sum_progress') }
  get lastTrackingDate(){ return this.ftracking.get('lastTrackingDate') }
  get startDate()       { return this.ftracking.get('startDate') }
  get endDate()         { return this.ftracking.get('endDate') }

  constructor(
    private riskServices    : RiskService,
    private trackingService : TrackingService,
    private formBuilder     : FormBuilder,
    public dialogRef        : MatDialogRef<NewtrackingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    const año = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth() + 1; // Sumamos 1 ya que los meses en JavaScript van de 0 a 11
    const dia = this.fechaActual.getDate();
    const mesFormateado = mes.toString().padStart(2, '0');
    const diaFormateado = dia.toString().padStart(2, '0');
    this.fechaFormateada = `${año}-${mesFormateado}-${diaFormateado}`;
    this.riskServices.getAction(this.data.id).subscribe(
      (resp: any) => {
        this.id_risk.setValue(resp.id_risk);
        this.pos.setValue(resp.pos);
        this.adescription.setValue(resp.adescription);
        this.monitoring_date.setValue(resp.monitoring_date);
        this.total_cost.setValue(resp.total_cost);
        this.sum_progress.setValue(resp.sum_progress);
        this.lastTrackingDate.setValue(resp.lastTrackingDate);
        this.startDate.setValue(resp.startDate);
        this.endDate.setValue(resp.endDate);
      }
    );
  }

  avProg(){
    const fechaInicio = new Date(this.startDate.value);
    const fechaFin = new Date(this.endDate.value);
    const difMili = fechaFin.getTime() - fechaInicio.getTime();
    const difMili2 = this.fechaActual.getTime() - fechaInicio.getTime();
    const diasT = (difMili / (1000 * 60 * 60 * 24))+1;
    const diasA = difMili2 / (1000 * 60 * 60 * 24);
    const prog = (diasA / diasT);
    return (prog);
  }

  saveTracking(){
    this.loadData = true;
    this.formSubmitted = true;
    const dataTracking: Itrackingrisk = {
      id_action    :  this.data.id,
      reg_date     :  this.fechaFormateada,
      progress     :  this.ftracking.get('progress').value,
      observations :  this.ftracking.get('observations').value ?? '',
    }
    this.riskServices.postTracking(dataTracking, localStorage.getItem('token')).subscribe(
      (resp: any) => {
        const savedKey = resp.key; // Obtener la clave asignada al guardar el registro

        this.editAction();
        this.dialogRef.close('save');
      },
      err=>{
        alerts.basicAlert("Error", 'Action saving error', "error")
      }
    );
  }
  editAction(){

    const sumprog = Number(this.ftracking.get('sum_progress').value) + Number(this.ftracking.get('progress').value);
    const dataAction: Iactions = {

      id_risk         : this.ftracking.get('id_risk').value ?? '',
      pos             : this.ftracking.get('pos').value ?? 0,
      adescription    : this.ftracking.get('adescription').value ?? '',
      startDate       : this.ftracking.get('startDate').value ?? '',
      endDate         : this.ftracking.get('endDate').value ?? '',
      monitoring_date : this.ftracking.get('monitoring_date').value ?? '',
      lastTrackingDate: this.fechaFormateada ?? '',
      sum_progress    : sumprog ?? 0,
      total_cost      : this.ftracking.get('total_cost').value ?? 0,
    }
    this.riskServices.patchDataAction(this.data.id, dataAction, localStorage.getItem('token')).subscribe(
    resp => {

    },
    err => {

      alerts.basicAlert("Error", 'Action saving error', "error")

    })
  }

}
