import { Component, Inject } from '@angular/core';

import { TrackingService } from 'src/app/services/tracking.service';
import { RiskService } from 'src/app/services/risk.service';
import { ConceptsService } from 'src/app/services/concepts.service';
import { Irisk, Irinteres } from 'src/app/interface/irisk';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { StepperOrientation} from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';
import { BreakpointObserver} from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-editrisk',
  templateUrl: './editrisk.component.html',
  styleUrls: ['./editrisk.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class EditriskComponent {

  availableUsers  : any[];
  interestedList  : any[] = [];
  rinterestedList : any[] = [];
  conceptsList    : any[] = [];
  selectedOptions : any[] = [];
  selectedOwners  : string[] = [];
  selectedInteres : string[] = [];
  numbers         : number[] = [1, 2, 3, 4, 5];
  rcost           : number = 0;
  rquality        : number = 0;
  rtime           : number = 0;
  rscope          : number = 0;
  reprobability   : number = 0;
  ophase          : string;
  otrosInputValue : string;
  formSubmitted   = false;
  loadData        = false;
  interesControl  = new FormControl();
  get formArray() : AbstractControl | null { return this.form_risk.get('formArray'); };

  public form_risk = this.formBuilder.group({
    formArray: this.formBuilder.array([
      this.formBuilder.group({
        active      : 1,
        id_project  : '',
        pos         : '',
        description : ['', Validators.required],
        id_concept  : ['', Validators.required],
        phase       : ['', Validators.required],
        oPhase      : '',
        response    : ['', Validators.required],
      }),
      this.formBuilder.group({
        probability : ['', Validators.required],
        imp_scope   : ['', Validators.required],
        imp_time    : ['', Validators.required],
        imp_cost    : ['', Validators.required],
        imp_quality : ['', Validators.required],
        imp_score   : 0,
        rimp_cost   : 0,
        rimp_quality: 0,
        rimp_scope  : 0,
        rimp_score  : 0,
        rimp_time   : 0,
        rprobability: 0,
        status      : ''
      }),
      this.formBuilder.group({
        owner           : '',
        closing_incharge: '',
        interested_risk : '',
        observations    : ''
      })
    ])
  });

  stepperOrientation: Observable<StepperOrientation>;

  get active()           { return this.form_risk.get('formArray').get('0').get('active') }
  get id_project()       { return this.form_risk.get('formArray').get('0').get('id_project') }
  get pos()              { return this.form_risk.get('formArray').get('0').get('pos') }
  get description()      { return this.form_risk.get('formArray').get('0').get('description') }
  get id_concept()       { return this.form_risk.get('formArray').get('0').get('id_concept') }
  get phase()            { return this.form_risk.get('formArray').get('0').get('phase') }
  get response()         { return this.form_risk.get('formArray').get('0').get('response') }
  get probability()      { return this.form_risk.get('formArray').get('1').get('probability') }
  get imp_scope()        { return this.form_risk.get('formArray').get('1').get('imp_scope') }
  get imp_time()         { return this.form_risk.get('formArray').get('1').get('imp_time') }
  get imp_cost()         { return this.form_risk.get('formArray').get('1').get('imp_cost') }
  get imp_quality()      { return this.form_risk.get('formArray').get('1').get('imp_quality') }
  get imp_score()        { return this.form_risk.get('formArray').get('1').get('imp_score') }
  get rimp_cost()        { return this.form_risk.get('formArray').get('1').get('rimp_cost') }
  get rimp_quality()     { return this.form_risk.get('formArray').get('1').get('rimp_quality') }
  get rimp_scope()       { return this.form_risk.get('formArray').get('1').get('rimp_scope') }
  get rimp_score()       { return this.form_risk.get('formArray').get('1').get('rimp_score') }
  get rimp_time()        { return this.form_risk.get('formArray').get('1').get('rimp_time') }
  get rprobability()     { return this.form_risk.get('formArray').get('1').get('rprobability') }
  get status()           { return this.form_risk.get('formArray').get('1').get('status') }
  get owner()            { return this.form_risk.get('formArray').get('2').get('owner') }
  get closing_incharge() { return this.form_risk.get('formArray').get('2').get('closing_incharge') }
  get observations()     { return this.form_risk.get('formArray').get('2').get('observations') }
  //get interested_risk()  { return this.form_risk.get('formArray').get('2').get('interested_risk') }

  constructor(
    private riskServices      : RiskService,
    private trackingService   : TrackingService,
    private conceptsService   : ConceptsService,
    private formBuilder       : FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private router            : Router,
    public dialogRef: MatDialogRef<EditriskComponent >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.getInt();

    this.riskServices.getRisk(this.data.id).subscribe(
      (resp: any) => {

        this.active.setValue(resp.active);
        this.id_project.setValue(resp.id_project);
        this.pos.setValue(resp.pos);
        this.description.setValue(resp.description);
        this.id_concept.setValue(resp.id_concept);
        this.phase.setValue(resp.phase);
        this.response.setValue(resp.response);
        this.probability.setValue(resp.probability);
        this.imp_scope.setValue(resp.imp_scope);
        this.imp_time.setValue(resp.imp_time);
        this.imp_cost.setValue(resp.imp_cost);
        this.imp_quality.setValue(resp.imp_quality);
        this.imp_score.setValue(resp.imp_score);
        this.rimp_cost.setValue(resp.rimp_cost);
        this.rimp_quality.setValue(resp.rimp_quality);
        this.rimp_scope.setValue(resp.rimp_scope);
        this.rimp_score.setValue(resp.rimp_score);
        this.rimp_time.setValue(resp.rimp_time);
        this.rprobability.setValue(resp.rprobability);
        this.status.setValue(resp.status);
        this.observations.setValue(resp.observations);
        //this.owner.setValue(resp.owner);
        this.closing_incharge.setValue(resp.closing_incharge);
        this.selectedOwners = resp.owner || [];
        this.owner.setValue(this.selectedOwners);

      }
    );
    this.getRint();

  }

  calcularScore(): number {
    this.rcost         = Number(this.form_risk.get('formArray').get('1').get('imp_cost').value);
    this.rquality      = Number(this.form_risk.get('formArray').get('1').get('imp_quality').value);
    this.rtime         = Number(this.form_risk.get('formArray').get('1').get('imp_time').value);
    this.rscope        = Number(this.form_risk.get('formArray').get('1').get('imp_scope').value);
    this.reprobability = Number(this.form_risk.get('formArray').get('1').get('probability').value);
    return (this.rcost*this.reprobability)+(this.rquality*this.reprobability)+(this.rtime*this.reprobability)+(this.rscope*this.reprobability);
  }

  onInteresSelect() {
    const selectedOwner = this.form_risk.get('formArray').get('2').get('owner').value;
    this.availableUsers = this.interestedList.filter(interes => interes.name !== selectedOwner);
    console.log('Available', this.availableUsers)
  }

  navigateToInterested()  {
    this.router.navigate(['/interested']);
  }

  onSelectionChange(event: MatSelectionListChange): void {
    //this.selectedOptions = event.source.selectedOptions.selected.map(option => option.value);
    this.selectedOptions = event.source.selectedOptions.selected.map(option => ({
      id_risk: option.value.id_int,
      name: option.value.name,
      email: option.value.email
    }));
  }

  async getInt() {
    //aqui qe pasar el id project que tengo los combo box
    await this.riskServices.getInterested(localStorage.getItem('project'))
    .then(dataInteres => {
      this.interestedList = dataInteres;
      this.getRint();
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }

  async getRint() {
    //aqui qe pasar el id project que tengo los combo box
    await this.riskServices.getRinterested(this.data.id)
    .then(dataInteres => {
      this.rinterestedList = dataInteres;

      this.selectedOptions = this.rinterestedList.map(option => ({
        name: option.name,
        email: option.email,
        id_risk: option.id_risk
      }));

      const interestIds = this.rinterestedList.map((interest) => interest.email);
      console.log(interestIds);
      this.selectedInteres = this.interestedList.filter((interested) =>
        interestIds.includes(interested.email)
      );
      this.interesControl.setValue(this.selectedInteres);
      console.log("rinteres"+interestIds);
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }

  editRisk(){
    if(this.form_risk.get('formArray').get('0').get('phase').value === 'Otros'){
      this.ophase = this.form_risk.get('formArray').get('0').get('oPhase').value;
    }else{
      this.ophase = this.form_risk.get('formArray').get('0').get('phase').value;
    }
    const dataRisk: Irisk = {
      active            :  this.form_risk.get('formArray').get('0').get('active').value ?? '',
      closing_incharge  :  this.form_risk.get('formArray').get('2').get('closing_incharge').value ?? '',
      description       :  this.form_risk.get('formArray').get('0').get('description').value ?? '',
      id_concept        :  this.form_risk.get('formArray').get('0').get('id_concept').value ?? '',
      id_project        :  this.form_risk.get('formArray').get('0').get('id_project').value ?? '',
      imp_cost          :  this.form_risk.get('formArray').get('1').get('imp_cost').value ?? '',
      imp_quality       :  this.form_risk.get('formArray').get('1').get('imp_quality').value ?? '',
      imp_scope         :  this.form_risk.get('formArray').get('1').get('imp_scope').value ?? '',
      imp_score         :  this.calcularScore(),
      imp_time          :  this.form_risk.get('formArray').get('1').get('imp_time').value ?? '',
      observations      :  this.form_risk.get('formArray').get('2').get('observations').value ?? '',
      owner             :  this.form_risk.get('formArray').get('2').get('owner').value ?? '',
      phase             :  this.ophase ?? '',
      pos               :  this.form_risk.get('formArray').get('0').get('pos').value ?? '',
      probability       :  this.form_risk.get('formArray').get('1').get('probability').value ?? '',
      response          :  this.form_risk.get('formArray').get('0').get('response').value ?? '',
      rimp_cost         :  this.form_risk.get('formArray').get('1').get('rimp_cost').value ?? '',
      rimp_quality      :  this.form_risk.get('formArray').get('1').get('rimp_quality').value ?? '',
      rimp_scope        :  this.form_risk.get('formArray').get('1').get('rimp_scope').value ?? '',
      rimp_score        :  this.form_risk.get('formArray').get('1').get('rimp_score').value ?? '',
      rimp_time         :  this.form_risk.get('formArray').get('1').get('rimp_time').value ?? '',
      rprobability      :  this.form_risk.get('formArray').get('1').get('rprobability').value ?? '',
      status            :  this.form_risk.get('formArray').get('1').get('status').value ?? '',
    }
    this.riskServices.patchDataRisk(this.data.id, dataRisk, localStorage.getItem('token')).subscribe(
    resp => {
      this.riskServices.deleteRinteresByRiskId(this.data.id, localStorage.getItem('token'));
      this.saveRinterested(this.data.id);

    },
    err => {

      alerts.basicAlert("Error", 'Risk saving error', "error")

    })
  }

  saveRinterested(key: string){
    this.selectedOptions.forEach((interest, index) => {

      const rinteres = {
        id_risk: key,
        name: interest.name,
        email: interest.email,
      };
      this.riskServices.postSelInterested(rinteres, localStorage.getItem('token')).subscribe(
        (resp: any) => {
          // Resto del código para guardar los detalles del interesado
        }
      );
    });
  }
}
