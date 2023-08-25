import { Component, Inject,  OnInit } from '@angular/core';

import { CommunicationsService } from 'src/app/services/communications.service';
import { TrackingService } from 'src/app/services/tracking.service';

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

import { Icommunications } from 'src/app/interface/icommunication';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-newcommunic',
  templateUrl: './newcommunic.component.html',
  styleUrls: ['./newcommunic.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class NewcommunicComponent implements OnInit {

  stepperOrientation    : Observable<StepperOrientation>;
  detailscomp           : any[] = [] ;
  interestedList        : any[] = [];
  selectedInteres       : any[] = [];
  selectedOptions       : any[] = [];
  pmbok                 : string[] = ['Inicio','Ejecucion', 'Monitoreo y Control', 'Cierre'];
  media                 : string[] = ['PDF', 'Word', 'Excel','Correo Electronico','Primavera P6','MS Project','Otros'];
  frq                   : string[] = ['Diario', 'Semanal', 'Mensual','Solo al Inicio','Solo al Final'];
  oformat               : string;
  archivosSeleccionados : Archivo[] = [];
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
        process     : ['', Validators.required],
        information : ['', Validators.required],
        format      : ['', Validators.required],
        formatO     : '',
        reference   : ['', Validators.required],
      }),
      this.formBuilder.group({
        area            : ['', Validators.required],
        owner           : ['', Validators.required],
        freq            : ['', Validators.required],
        dayini          : ['', Validators.required],
        timeini         : ['', Validators.required],
        group           : ['', Validators.required],
        interested_comm : ['', Validators.required]
      })
    ])
  });

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
    public dialogRef            : MatDialogRef<NewcommunicComponent >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {

    this.getCommunicint();

  }

  buscarSubdetalle(id: string) {
    this.communicationservice.buscarSubdetalle(id).subscribe(
      subdetalles => {
        if (subdetalles.length > 0) {
          console.log('Subdetalles:', subdetalles);
          // Realiza acciones con los subdetalles obtenidos
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


  saveCommunications(){
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
      active        : 1,
      pos           : this.data.idpos+1,
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
    this.communicationservice.postCommunic(dataCommunications, localStorage.getItem('token')).subscribe(
    (resp: any) => { // Indicar que la respuesta es de tipo 'any'
        const savedKey = resp.key; // Obtener la clave asignada al guardar el registro
        // Guardar el detalle utilizando la clave
        this.saveToDetailInterested(savedKey);
        this.dialogRef.close('save');
      },
      err=>{
        alerts.basicAlert("Error", 'User saving error', "error")
      }
    );
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

  adjuntarArchivos(event: any): void {

    const archivos: FileList = event.target.files;
    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];
      // Generar miniatura y obtener su URL
      const miniaturaUrl = URL.createObjectURL(archivo);

      // Guardar archivo en el almacenamiento (storage) y enviar por correo
      const filePath = `pdf/${archivo.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, archivo);

      task.snapshotChanges().subscribe(() => {
        // Archivo subido correctamente, aquí puedes realizar acciones adicionales si es necesario
        // Por ejemplo, enviar el correo con el archivo adjunto utilizando el Trigger Email desde Firestore

        // Agregar archivo a la lista de archivos seleccionados para mostrar miniaturas
        this.archivosSeleccionados.push({
          nombre: archivo.name,
          thumbnailUrl: miniaturaUrl
        });
      });
    }
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


interface Archivo {
  nombre: string;
  thumbnailUrl: string;
}
