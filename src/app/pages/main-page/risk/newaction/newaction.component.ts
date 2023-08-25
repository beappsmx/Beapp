import { Component, OnInit, Inject  } from '@angular/core';
import { TrackingService } from 'src/app/services/tracking.service';
import { RiskService } from 'src/app/services/risk.service';
import { Irisk, Iactions, Iresources } from 'src/app/interface/irisk';

import { StepperOrientation} from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Observable} from 'rxjs';
import { BreakpointObserver} from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { map} from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-newaction',
  templateUrl: './newaction.component.html',
  styleUrls: ['./newaction.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class NewactionComponent {
  units           : string[] = ['h','pza','m','g','kg','ton'];
  numbers         : number[] = [1, 2, 3, 4, 5];
  resources       : any[] = [];
  cost            : number = 0;
  quality         : number = 0;
  time            : number = 0;
  scope           : number = 0;
  probability     : number = 0;
  selectedOption  : number = 0;
  loadData        = false;
  formSubmitted   = false;
  get formArray() : AbstractControl | null { return this.faction.get('formArray'); };


  public faction = this.formBuilder.group({
    formArray: this.formBuilder.array([
      this.formBuilder.group({ // acciones de mitigacion
        id_risk          : '',
        adescription     : ['', Validators.required],
        startDate        : ['', Validators.required],
        endDate          : ['', Validators.required],
        monitoring_date  : ['', Validators.required],
        lastTrackingDate : '',
        sum_progress     : 0
      }),
      this.formBuilder.group({ // recursos para las acciones de mitigacion
        id_resource     : '',
        id_action       : '',
        rdescription    : '',
        unit            : '',
        quantity        : '',
        cost            : '',
        total_cost      : 0

      }),
      this.formBuilder.group({ // revision del riesgo
        rprobability    : ['', Validators.required],
        rimp_cost       : ['', Validators.required],
        rimp_quality    : ['', Validators.required],
        rimp_scope      : ['', Validators.required],
        rimp_time       : ['', Validators.required],
        rimp_score      : 0,
        observations    : '',
        active          : '',
        incharge        : '',
        description     : '',
        id_concept      : '',
        id_project      : '',
        imp_cost        : '',
        imp_quality     : '',
        imp_scope       : '',
        imp_score       : '',
        imp_time        : '',
        owner           : '',
        phase           : '',
        pos             : '',
        prob            : '',
        response        : '',
        status          : ''
      })
    ])
  });
  stepperOrientation: Observable<StepperOrientation>;
  get active()        { return this.faction.get('formArray').get('2').get('active') }
  get incharge()      { return this.faction.get('formArray').get('2').get('incharge') }
  get description()   { return this.faction.get('formArray').get('2').get('description') }
  get id_concept()    { return this.faction.get('formArray').get('2').get('id_concept') }
  get id_project()    { return this.faction.get('formArray').get('2').get('id_project') }
  get imp_cost()      { return this.faction.get('formArray').get('2').get('imp_cost') }
  get imp_quality()   { return this.faction.get('formArray').get('2').get('imp_quality') }
  get imp_scope()     { return this.faction.get('formArray').get('2').get('imp_scope') }
  get imp_score()     { return this.faction.get('formArray').get('2').get('imp_score') }
  get imp_time()      { return this.faction.get('formArray').get('2').get('imp_time') }
  get observations()  { return this.faction.get('formArray').get('2').get('observations') }
  get owner()         { return this.faction.get('formArray').get('2').get('owner') }
  get phase()         { return this.faction.get('formArray').get('2').get('phase') }
  get pos()           { return this.faction.get('formArray').get('2').get('pos') }
  get prob()          { return this.faction.get('formArray').get('2').get('prob') }
  get response()      { return this.faction.get('formArray').get('2').get('response') }
  get status()        { return this.faction.get('formArray').get('2').get('status') }
  get rprobability()  { return this.faction.get('formArray').get('2').get('rprobability') }
  get rimp_cost()     { return this.faction.get('formArray').get('2').get('rimp_cost') }
  get rimp_quality()  { return this.faction.get('formArray').get('2').get('rimp_quality') }
  get rimp_scope()    { return this.faction.get('formArray').get('2').get('rimp_scope') }
  get rimp_time()     { return this.faction.get('formArray').get('2').get('rimp_time') }
  get rimp_score()    { return this.faction.get('formArray').get('2').get('rimp_score') }

  constructor(
    private riskServices      : RiskService,
    private trackingService   : TrackingService,
    private formBuilder       : FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private router            : Router,
    public dialogRef          : MatDialogRef<NewactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    // Crear los controles de formularios para los slide toggles
  }

  addResource(): void{

    const resource = {
      rdescription: this.faction.get('formArray').get('1').get('rdescription').value,
      quantity: this.faction.get('formArray').get('1').get('quantity').value,
      unit: this.faction.get('formArray').get('1').get('unit').value,
      cost: this.faction.get('formArray').get('1').get('cost').value,
    };
    this.resources.push(resource);

    this.faction.get('formArray').get('1').get('rdescription').patchValue('');
    this.faction.get('formArray').get('1').get('quantity').patchValue('');
    this.faction.get('formArray').get('1').get('unit').patchValue('');
    this.faction.get('formArray').get('1').get('cost').patchValue('');
  }

  deleteResource(index: number): void {
    this.resources.splice(index, 1);
  }

  sumResource(): number {
    return this.resources.reduce((sum, res) => sum + res.cost, 0);
  }

  calcularScore(): number {
    this.cost         = Number(this.faction.get('formArray').get('2').get('rimp_cost').value);
    this.quality      = Number(this.faction.get('formArray').get('2').get('rimp_quality').value);
    this.time         = Number(this.faction.get('formArray').get('2').get('rimp_time').value);
    this.scope        = Number(this.faction.get('formArray').get('2').get('rimp_scope').value);
    this.probability  = Number(this.faction.get('formArray').get('2').get('rprobability').value);
    return (this.cost*this.probability)+(this.quality*this.probability)+(this.time*this.probability)+(this.scope*this.probability);
  }

  ngOnInit() {
    console.log(this.data.id);
    this.riskServices.getRisk(this.data.id).subscribe(
      (resp: any) => {
        this.active.setValue(resp.active);
        this.incharge.setValue(resp.closing_incharge);
        this.description.setValue(resp.description);
        this.id_concept.setValue(resp.id_concept);
        this.id_project.setValue(resp.id_project);
        this.imp_cost.setValue(resp.imp_cost);
        this.imp_quality.setValue(resp.imp_quality);
        this.imp_scope.setValue(resp.imp_scope);
        this.imp_score.setValue(resp.imp_score);
        this.imp_time.setValue(resp.imp_time);
        this.observations.setValue(resp.observations);
        this.owner.setValue(resp.owner);
        this.phase.setValue(resp.phase);
        this.pos.setValue(resp.pos);
        this.prob.setValue(resp.probability);
        this.response.setValue(resp.response);
        this.rprobability.setValue(resp.rprobability);
        this.status.setValue(resp.status);
        this.rimp_cost.setValue(resp.rimp_cost);
        this.rimp_quality.setValue(resp.rimp_quality);
        this.rimp_scope.setValue(resp.rimp_scope);
        this.rimp_time.setValue(resp.rimp_time);
        this.rimp_score.setValue(resp.rimp_score);
      }
    );
  }

  saveAction(){
    this.loadData = true;
    this.formSubmitted = true;
    const dataActions: Iactions = {

      id_risk         :  this.data.id,
      pos             :  this.data.idpos + 1,
      adescription    :  this.faction.get('formArray').get('0').get('adescription').value ?? '',
      startDate       :  this.faction.get('formArray').get('0').get('startDate').value ?? '',
      endDate         :  this.faction.get('formArray').get('0').get('endDate').value ?? '',
      monitoring_date :  this.faction.get('formArray').get('0').get('monitoring_date').value ?? '',
      lastTrackingDate:  this.faction.get('formArray').get('0').get('lastTrackingDate').value ?? '',
      sum_progress    :  this.faction.get('formArray').get('0').get('sum_progress').value ?? '',
      total_cost      :  this.sumResource(),

    }
    this.riskServices.postAction(dataActions, localStorage.getItem('token')).subscribe(
      (resp: any) => {
        const savedKey = resp.key; // Obtener la clave asignada al guardar el registro
        alerts.basicAlert('Ok', 'The action has been saved', 'success');
        this.saveResource(savedKey);
        this.editRisk();
        this.dialogRef.close('save');
      },
      err=>{
        alerts.basicAlert("Error", 'Action saving error', "error")
      }
    );
  }

  saveResource(key: string): void {
    this.resources.forEach((res, index) => {

      const resource = {
        id_action: key,
        rdescription: res.rdescription,
        unit: res.unit,
        quantity: res.quantity,
        cost: res.cost,
      };
      this.riskServices.postResources(resource, localStorage.getItem('token')).subscribe(
        (resp: any) => {
          // Resto del código para guardar los detalles del interesado
        }
      );
    });
  }

  editRisk(){

    const dataRisk: Irisk = {

      active            :  this.faction.get('formArray').get('2').get('active').value ?? '',
      closing_incharge  :  this.faction.get('formArray').get('2').get('incharge').value ?? '',
      description       :  this.faction.get('formArray').get('2').get('description').value ?? '',
      id_concept        :  this.faction.get('formArray').get('2').get('id_concept').value ?? '',
      id_project        :  this.faction.get('formArray').get('2').get('id_project').value ?? '',
      imp_cost          :  this.faction.get('formArray').get('2').get('imp_cost').value ?? '',
      imp_quality       :  this.faction.get('formArray').get('2').get('imp_quality').value ?? '',
      imp_scope         :  this.faction.get('formArray').get('2').get('imp_scope').value ?? '',
      imp_score         :  this.faction.get('formArray').get('2').get('imp_score').value ?? '',
      imp_time          :  this.faction.get('formArray').get('2').get('imp_time').value ?? '',
      observations      :  this.faction.get('formArray').get('2').get('observations').value ?? '',
      owner             :  this.faction.get('formArray').get('2').get('owner').value ?? '',
      phase             :  this.faction.get('formArray').get('2').get('phase').value ?? '',
      pos               :  this.faction.get('formArray').get('2').get('pos').value ?? '',
      probability       :  this.faction.get('formArray').get('2').get('prob').value ?? '',
      response          :  this.faction.get('formArray').get('2').get('response').value ?? '',
      rimp_cost         :  this.faction.get('formArray').get('2').get('rimp_cost').value ?? '',
      rimp_quality      :  this.faction.get('formArray').get('2').get('rimp_quality').value ?? '',
      rimp_scope        :  this.faction.get('formArray').get('2').get('rimp_scope').value ?? '',
      rimp_score        :  this.calcularScore(),
      rimp_time         :  this.faction.get('formArray').get('2').get('rimp_time').value ?? '',
      rprobability      :  this.faction.get('formArray').get('2').get('rprobability').value ?? '',
      status            :  'En proceso de mitigación' ?? '',

    }
    this.riskServices.patchDataRisk(this.data.id, dataRisk, localStorage.getItem('token')).subscribe(
    resp => {

    },
    err => {

      alerts.basicAlert("Error", 'Risk saving error', "error")

    })

  }

}
