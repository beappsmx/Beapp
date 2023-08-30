import { Component, Inject } from '@angular/core';

import { TrackingService } from 'src/app/services/tracking.service';
import { RiskService } from 'src/app/services/risk.service';
import { ConceptsService } from 'src/app/services/concepts.service';
import { Irisk, Irinteres } from 'src/app/interface/irisk';

import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
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
  selector: 'app-newrisk',
  templateUrl: './newrisk.component.html',
  styleUrls: ['./newrisk.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class NewriskComponent {

  availableUsers  : any[];
  interestedList  : any[] = [];
  conceptsList    : any[] = [];
  selectedOptions : any[] = [];
  selectedOwner   : string[] = [];
  selectedRinteres: Irinteres[] = [];
  numbers         : number[] = [1, 2, 3, 4, 5];
  cost            : number = 0;
  quality         : number = 0;
  time            : number = 0;
  scope           : number = 0;
  probability     : number = 0;
  phase           : string;
  otrosInputValue : string;
  formSubmitted   = false;
  loadData        = false;
  get formArray() : AbstractControl | null { return this.form_risk.get('formArray'); };

  // Agregar los controles al formulario reactivo
  public form_risk = this.formBuilder.group({
    formArray: this.formBuilder.array([
      this.formBuilder.group({
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
        imp_score   : 0
      }),
      this.formBuilder.group({
        owner           : ['', Validators.required],
        closing_incharge: ['', Validators.required],
        interested_risk : ['', Validators.required]
      })
    ])
  });
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private riskServices      : RiskService,
    private trackingService   : TrackingService,
    private conceptsService   : ConceptsService,
    private formBuilder       : FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private router            : Router,
    public dialogRef          : MatDialogRef<NewriskComponent >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    // Crear los controles de formularios para los slide toggles
  }

  calcularScore(): number {
    this.cost         = Number(this.form_risk.get('formArray').get('1').get('imp_cost').value);
    this.quality      = Number(this.form_risk.get('formArray').get('1').get('imp_quality').value);
    this.time         = Number(this.form_risk.get('formArray').get('1').get('imp_time').value);
    this.scope        = Number(this.form_risk.get('formArray').get('1').get('imp_scope').value);
    this.probability  = Number(this.form_risk.get('formArray').get('1').get('probability').value);
    return (this.cost*this.probability)+(this.quality*this.probability)+(this.time*this.probability)+(this.scope*this.probability);
  }

  onSelectionChange(event: MatSelectionListChange): void {
    //this.selectedOptions = event.source.selectedOptions.selected.map(option => option.value);
    this.selectedOptions = event.source.selectedOptions.selected.map(option => ({
      id_risk: option.value.id_int,
      name: option.value.name,
      email: option.value.email
    }));
  }

  onOwnerSelectionChange(event: MatSelectionListChange): void {
    this.selectedOwner = event.source.selectedOptions.selected.map(option => option.value.name);
  }

  ngOnInit() {

    this.getInt();
    this.getConceptsxActiv();
  }

  saveRisk(){
    if(this.form_risk.get('formArray').get('0').get('phase').value === 'Otros'){
      this.phase = this.form_risk.get('formArray').get('0').get('oPhase').value;
    }else{
      this.phase = this.form_risk.get('formArray').get('0').get('phase').value;
    }
    this.loadData = true;
    this.formSubmitted = true;
    const dataRisk: Irisk = {

      active           :  1,
      closing_incharge :  this.form_risk.get('formArray').get('2').get('closing_incharge').value ?? '',
      description      :  this.form_risk.get('formArray').get('0').get('description').value ?? '',
      id_concept       :  this.form_risk.get('formArray').get('0').get('id_concept').value ?? '',
      id_project       :  this.trackingService.getProject(),
      imp_cost         :  this.form_risk.get('formArray').get('1').get('imp_cost').value ?? '',
      imp_quality      :  this.form_risk.get('formArray').get('1').get('imp_quality').value ?? '',
      imp_scope        :  this.form_risk.get('formArray').get('1').get('imp_scope').value ?? '',
      imp_score        :  this.calcularScore(),
      imp_time         :  this.form_risk.get('formArray').get('1').get('imp_time').value ?? '',
      observations     :  "" ?? '',
      // owner            :  this.form_risk.get('formArray').get('2').get('owner').value ?? '',
      owner            :  this.selectedOwner,
      phase            :  this.phase ?? '',
      pos              :  this.data.idpos + 1,
      probability      :  this.form_risk.get('formArray').get('1').get('probability').value ?? '',
      response         :  this.form_risk.get('formArray').get('0').get('response').value ?? '',
      rimp_cost        :  this.form_risk.get('formArray').get('1').get('imp_cost').value ?? '',
      rimp_quality     :  this.form_risk.get('formArray').get('1').get('imp_quality').value ?? '',
      rimp_scope       :  this.form_risk.get('formArray').get('1').get('imp_scope').value ?? '',
      rimp_score       :  this.calcularScore(),
      rimp_time        :  this.form_risk.get('formArray').get('1').get('imp_time').value ?? '',
      rprobability     :  this.form_risk.get('formArray').get('1').get('probability').value ?? '',
      status           :  "Abierto" ?? '',

    }
    this.riskServices.postRisk(dataRisk, localStorage.getItem('token')).subscribe(
      (resp: any) => {
        const savedKey = resp.key; // Obtener la clave asignada al guardar el registro
        alerts.basicAlert('Ok', 'The risk has been saved', 'success');
        this.saveRinterested(savedKey);
        this.dialogRef.close('save');
      },
      err=>{
        alerts.basicAlert("Error", 'User saving error', "error")
      }
    );
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

  getInt() {
    //aqui qe pasar el id project que tengo los combo box
    this.riskServices.getInterested(localStorage.getItem('project'))
    .then(dataInteres => {
      this.interestedList = dataInteres;
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }

  getConceptsxActiv() {
    this.conceptsService.getDataConceptsxActivities(localStorage.getItem('project'))
    .subscribe(data => {
      this.conceptsList = data ;
    });
  }

  navigateToInterested()  {
    this.router.navigate(['/interested']);
  }

  onInteresSelect() {
    const selectedOwner = this.form_risk.get('formArray').get('2').get('owner').value;
    this.availableUsers = this.interestedList.filter(interes => interes.name !== selectedOwner);
    console.log('Available', this.availableUsers)

  }
}
