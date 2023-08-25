import { Component, Inject,  OnInit } from '@angular/core';

import { CommunicationsService } from 'src/app/services/communications.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { StepperOrientation} from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';
import { BreakpointObserver} from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { alerts } from 'src/app/helpers/alerts';

import { Icommunications } from 'src/app/interface/icommunication';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-editcommunic',
  templateUrl: './editcommunic.component.html',
  styleUrls: ['./editcommunic.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class EditcommunicComponent implements OnInit  {

  stepperOrientation    : Observable<StepperOrientation>;
  detailscomp           : any[] = [] ;
  interestedList        : any[] = [];
  selectedInteres       : any[] = [];
  selectedOptions       : any[] = [];
  pmbok                 : string[] = ['Ejecucion', 'Monitoreo y Control', 'Cierre'];
  media                 : string[] = ['PDF', 'Word', 'Excel','Otros'];
  frq                   : string[] = ['Diario', 'Semanal', 'Mensual'];
  frec                  : string[] = [];
  oformat               : string;
  day                   : string;
  time                  : string;
  dateAndTime           : string;
  availableUsers        : any[];
  selectedInterested    : { name: string; email: string; }[] = [];
  selectedValue         : string;
  selectedOption        : string;
  otrosInputValue       : string;
  formSubmitted         = false;
  loadData              = false;
  panelOpenState        = false;
  get formArray()       : AbstractControl | null { return this.fcommunications.get('formArray'); };

  public fcommunications = this.formBuilder.group({
    formArray: this.formBuilder.array([
      this.formBuilder.group({
        active      :  1,
        pos         :  0,
        process     : ['', Validators.required],
        information : ['', Validators.required],
        format      : ['', Validators.required],
        formatO     : '',
        reference   : ['', Validators.required],
      }),
      this.formBuilder.group({
        area            : ['', Validators.required],
        owner           : ['', Validators.required],
        frequence       : '',
        freq            : ['', Validators.required],
        dayini          : ['', Validators.required],
        timeini         : ['', Validators.required],
        group           : ['', Validators.required],
        interested_comm : ['', Validators.required]
      })
    ])
  });
  get active()      { return this.fcommunications.get('formArray').get('0').get('active') }
  get pos()         { return this.fcommunications.get('formArray').get('0').get('pos') }
  get process()     { return this.fcommunications.get('formArray').get('0').get('process') }
  get information() { return this.fcommunications.get('formArray').get('0').get('information') }
  get format()      { return this.fcommunications.get('formArray').get('0').get('format') }
  get reference()   { return this.fcommunications.get('formArray').get('0').get('reference') }
  get area()        { return this.fcommunications.get('formArray').get('1').get('area') }
  get owner()       { return this.fcommunications.get('formArray').get('1').get('owner') }
  get frequence()   { return this.fcommunications.get('formArray').get('1').get('frequence') }
  get freq()        { return this.fcommunications.get('formArray').get('1').get('freq') }
  get dayini()      { return this.fcommunications.get('formArray').get('1').get('dayini') }
  get timeini()     { return this.fcommunications.get('formArray').get('1').get('timeini') }
  get group()       { return this.fcommunications.get('formArray').get('1').get('group') }


  recibirDatos(detailscomp: any[] = [] ):void {
    this.detailscomp = detailscomp ;
    console.log('recibido');
  }

  public fdocuments = this.formBuilder.group({

    fecha       : '',
    descripcion :  '',
    owner        :  '',
  });

  constructor(
    private communicationservice: CommunicationsService,
    private trackingService     : TrackingService,
    private formBuilder         : FormBuilder,
    private breakpointObserver  : BreakpointObserver,
    private router              : Router,
    private storage             : AngularFireStorage,
    public dialogRef            : MatDialogRef<EditcommunicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {

    this.getCommunicint();
    this.communicationservice.getComm(this.data.id).subscribe(
      (resp: any) => {
        this.active.setValue(resp.active);
        this.pos.setValue(resp.pos);
        this.process.setValue(resp.procces);
        this.information.setValue(resp.information);
        this.format.setValue(resp.format);
        this.reference.setValue(resp.reference);
        this.area.setValue(resp.area);
        this.owner.setValue(resp.owner);
        this.frequence.setValue(resp.frequence);
        this.group.setValue(resp.group);

        [this.frec, this.dateAndTime] = this.frequence.value.split(',').map(item => item.trim());
        [this.day, this.time] = this.dateAndTime.split(' ');

        this.freq.setValue(this.frec);
        this.dayini.setValue(this.day);
        this.timeini.setValue(this.time);

        console.log(this.freq);
        console.log(this.day);
        console.log(this.time);
      }
    );
    this.buscarSubdetalle(this.data.id);

  }

  buscarSubdetalle(id: string) {
    this.communicationservice.buscarSubdetalle(id).subscribe(
      subdetalles => {
        if (subdetalles.length > 0) {
          console.log('Subdetalles:', subdetalles);
          // Realiza acciones con los subdetalles obtenidos
          this.availableUsers = subdetalles;
        } else {
          console.log('No se encontraron subdetalles');
        }
      },
      error => {
        console.error('Error al buscar los subdetalles:', error);
      }
    );
  }


  getCommunicint() {
    //aqui qe pasar el id project que tengo los combo box
    this.communicationservice.getInterested(localStorage.getItem('project'))
    .then(dataInteres => {
      this.interestedList = dataInteres;
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }



  onInteresSelect() {

    const selectedOwner = this.fcommunications.get('formArray').get('1').get('owner').value;
    this.availableUsers = this.interestedList.filter(interes => interes.name !== selectedOwner);

  }

  onSelectionChange(event: MatSelectionListChange): void {
    //this.selectedOptions = event.source.selectedOptions.selected.map(option => option.value);
    this.selectedOptions = event.source.selectedOptions.selected.map(option => ({
      id_comm: option.value.id_int,
      name: option.value.name,
      email: option.value.email
    }));
  }


  editCommunications(){
    if(this.fcommunications.get('formArray').get('0').get('format').value === 'Otros'){
      this.oformat = this.fcommunications.get('formArray').get('0').get('formatO').value;
    }else{
      this.oformat = this.fcommunications.get('formArray').get('0').get('format').value;
    }
    this.loadData = true;
    this.formSubmitted = true;
    const frecc = this.fcommunications.get('formArray').get('1').get('freq').value + ', ' + this.fcommunications.get('formArray').get('1').get('dayini').value + ' ' +  this.fcommunications.get('formArray').get('1').get('timeini').value;
    console.log(frecc);
    /*=============================================
    Validamos y capturamos la informacion del formulario en la interfaz
    =============================================*/
    const dataCommunications: Icommunications = {
      active        : this.fcommunications.get('formArray').get('0').get('active').value ?? '',
      pos           : this.fcommunications.get('formArray').get('0').get('pos').value ?? 0,
      procces       : this.fcommunications.get('formArray').get('0').get('process').value ?? '',
      id_project    : localStorage.getItem('project'),
      information   : this.fcommunications.get('formArray').get('0').get('information').value ?? '',
      format        : this.oformat ?? '',
      area          : this.fcommunications.get('formArray').get('1').get('area').value ?? '',
      owner         : this.fcommunications.get('formArray').get('1').get('owner').value ?? '',
      reference     : this.fcommunications.get('formArray').get('0').get('reference').value ?? '',
      frequence     : frecc ?? '',
      group         : this.fcommunications.get('formArray').get('1').get('group').value ?? ''
    }
    this.communicationservice.patchDataComm(this.data.id, dataCommunications, localStorage.getItem('token')).subscribe(
    resp => {

    },
    err => {

      alerts.basicAlert("Error", 'Risk saving error', "error")

    })
  }


  saveToDetailInterested(key: string) {
    // Recorrer el arreglo selectedInterested y agregar la clave correspondiente a cada nombre
    const details: any[] = this.selectedOptions.map(interest => {
      return {
        id: key,
        name     : interest.name,
        email    : interest.email,
        position : '' ,
        active   : 1
      };
    });

    this.communicationservice.postCommunicDetail(details, localStorage.getItem('token')).subscribe(
      (resp: any) => {

      // console.log('Details:', details);
      // Resto del código para guardar los detalles del interesado
      }
    )
  }

  enviarFormulario() {
    // Lógica para enviar el formulario y subir los archivos al almacenamiento
    // Puedes implementar la funcionalidad correspondiente aquí
    console.log('Formulario enviado');
  }


  cancelar() {
    // Lógica para cancelar la ventana
    // Puedes implementar la funcionalidad correspondiente aquí
    console.log('Ventana cancelada');
  }

  navigateToInterested()  {
    this.router.navigate(['/interested']);
  }

}
